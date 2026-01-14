import { pool } from "../db.js";

export const BookingModel = {

  // Creates a pending booking with an expiration time.
  // Prevents double booking via row locking (FOR UPDATE).
  async createPendingBooking({ user_id, session_id, seat_ids }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      
      // Mark expired pending books as expired
      await client.query(`
        UPDATE booking 
        SET status = 'EXPIRED' 
        WHERE status = 'PENDING' 
        AND expires_at < NOW()
      `);

      // Free up the expired seats by deleting them from the booking_seat table 
      await client.query(`
        DELETE FROM booking_seat 
        WHERE booking_id IN (
          SELECT booking_id FROM booking WHERE status = 'EXPIRED'
        )
      `);

      // Lock and validate seats to ensure they aren't taken
      const lockSeatsQuery = `
        SELECT s.seat_id
        FROM seat s
        JOIN session sess ON sess.room_id = s.room_id
        LEFT JOIN booking_seat bs
          ON bs.seat_id = s.seat_id
          AND bs.session_id = $1
        WHERE s.seat_id = ANY($2)
          AND (
            bs.status = 'CONFIRMED'
            OR bs.status = 'PENDING'
          )
        FOR UPDATE;
      `;

      const locked = await client.query(lockSeatsQuery, [
        session_id,
        seat_ids
      ]);

      if (locked.rows.length > 0) {
        const err = new Error("Some seats are already booked or pending");
        err.code = "SEAT_TAKEN";
        throw err;
      }

      // Create the Booking Record
      const createBookingQuery = `
        INSERT INTO booking (user_id, session_id, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
        RETURNING booking_id;
      `;

      const {
        rows: [{ booking_id }]
      } = await client.query(createBookingQuery, [user_id, session_id]);

      // Create the Booking Seat records (PENDING)
      const seatValues = seat_ids
        .map(
          (_, i) =>
            `($1, $${i * 2 + 2}, $${i * 2 + 3}, 'PENDING')`
        )
        .join(",");

      const seatParams = [booking_id];
      seat_ids.forEach(seat_id => {
        seatParams.push(seat_id, session_id);
      });

      const insertSeatsQuery = `
        INSERT INTO booking_seat (booking_id, seat_id, session_id, status)
        VALUES ${seatValues};
      `;

      await client.query(insertSeatsQuery, seatParams);

      await client.query("COMMIT");

      return {
        booking_id,
        status: "PENDING",
        expires_in_minutes: 10
      };
    } catch (err) {
      await client.query("ROLLBACK");
      // Postgres unique violation code
      if (err.code === "23505") {
        const seatErr = new Error("Seat already taken");
        seatErr.code = "SEAT_TAKEN";
        throw seatErr;
      }
      throw err;
    } finally {
      client.release();
    }
  },

  // Confirms a booking if it hasn't expired.
  async confirmBooking(booking_id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if booking exists and is not expired
      const checkQuery = `
        SELECT * FROM booking 
        WHERE booking_id = $1 
        FOR UPDATE
      `;
      const { rows } = await client.query(checkQuery, [booking_id]);

      if (rows.length === 0) {
        throw new Error("Booking not found");
      }

      const booking = rows[0];
      const now = new Date();
      
      if (booking.status === 'CONFIRMED') {
         await client.query("COMMIT");
         return booking; // Already confirmed
      }

      // Booking is expired 
      if (booking.status === 'EXPIRED' || new Date(booking.expires_at) < now) {
        throw new Error("Booking expired");
      }

      // Update Booking Status
      const updateBooking = `
        UPDATE booking 
        SET status = 'CONFIRMED' 
        WHERE booking_id = $1 
        RETURNING *
      `;
      await client.query(updateBooking, [booking_id]);

      // Update Booking Seats Status
      const updateSeats = `
        UPDATE booking_seat 
        SET status = 'CONFIRMED' 
        WHERE booking_id = $1
      `;
      await client.query(updateSeats, [booking_id]);

      await client.query("COMMIT");
      return { ...booking, status: 'CONFIRMED' };

    } catch (err) {
      await client.query("ROLLBACK");

      // If it's simply expired or not found, return null
      if (err.message === "Booking expired" || err.message === "Booking not found") {
        return null; 
      }
      throw err;
    } finally {
      client.release();
    }
  },

  // Deletes a booking
  async cancelBooking(booking_id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Delete seats from booking_seat
        await client.query('DELETE FROM booking_seat WHERE booking_id = $1', [booking_id]);
        
        // Set the booking as cancelled
        const query = `
          UPDATE booking 
          SET status = 'CANCELLED' 
          WHERE booking_id = $1 
          RETURNING booking_id
        `;
        const { rows } = await client.query(query, [booking_id]);
        
        await client.query('COMMIT');
        return rows.length > 0;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
  },

  // Gets all booking for a given user
  async findByUser(user_id) {
    const query = `
      SELECT 
        b.booking_id,
        b.session_id,
        b.status,
        b.expires_at,
        b.created_at,
        ARRAY_AGG(bs.seat_id) as seats
      FROM booking b
      LEFT JOIN booking_seat bs ON b.booking_id = bs.booking_id
      WHERE b.user_id = $1
      GROUP BY b.booking_id
      ORDER BY b.created_at DESC;
    `;
    
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
};