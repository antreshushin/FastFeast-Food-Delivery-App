const db = require('../config/database');

class Delivery {
    static async findAll() {
        const query = 'SELECT * FROM delivery';
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByOrderId(order_id) {
        const query = 'SELECT * FROM delivery WHERE order_id = ?';
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByAgentId(agent_id) {
        const query = 'SELECT * FROM delivery WHERE agent_id = ?';
        try {
            const [rows] = await db.query(query, [agent_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByStatus(status) {
        const query = 'SELECT * FROM delivery WHERE status = ?';
        try {
            const [rows] = await db.query(query, [status]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(deliveryData) {
        const query = 'INSERT INTO delivery (order_id, agent_id, ETA, status) VALUES (?, ?, ?, ?)';
        try {
            const [result] = await db.query(query, [
                deliveryData.order_id,
                deliveryData.agent_id,
                deliveryData.ETA,
                deliveryData.status
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(order_id, deliveryData) {
        const query = 'UPDATE delivery SET agent_id = ?, ETA = ?, status = ? WHERE order_id = ?';
        try {
            const [result] = await db.query(query, [
                deliveryData.agent_id,
                deliveryData.ETA,
                deliveryData.status,
                order_id
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(order_id, status) {
        const query = 'UPDATE delivery SET status = ? WHERE order_id = ?';
        try {
            const [result] = await db.query(query, [status, order_id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(order_id) {
        const query = 'DELETE FROM delivery WHERE order_id = ?';
        try {
            const [result] = await db.query(query, [order_id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getDeliveryWithOrder(order_id) {
        const query = `
            SELECT d.*, od.order_date, od.total_price, od.payment_id, od.address_id, od.user_id
            FROM delivery d
            JOIN order_details od ON d.order_id = od.order_id
            WHERE d.order_id = ?
        `;
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getDeliveryWithAgent(order_id) {
        const query = `
            SELECT d.*, da.phone_number, da.email_address, da.number_of_trips, da.is_free, da.SSN
            FROM delivery d
            JOIN delivery_agent da ON d.agent_id = da.agent_id
            WHERE d.order_id = ?
        `;
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getDeliveryWithFullDetails(order_id) {
        const query = `
            SELECT d.*, 
                   od.order_date, od.total_price, od.payment_id, od.address_id, od.user_id,
                   da.phone_number, da.email_address, da.number_of_trips, da.is_free, da.SSN
            FROM delivery d
            JOIN order_details od ON d.order_id = od.order_id
            JOIN delivery_agent da ON d.agent_id = da.agent_id
            WHERE d.order_id = ?
        `;
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getDeliveriesByDateRange(startDate, endDate) {
        const query = `
            SELECT d.*, od.order_date, od.total_price
            FROM delivery d
            JOIN order_details od ON d.order_id = od.order_id
            WHERE od.order_date BETWEEN ? AND ?
            ORDER BY od.order_date DESC
        `;
        try {
            const [rows] = await db.query(query, [startDate, endDate]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Delivery;
