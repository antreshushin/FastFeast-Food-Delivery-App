const db = require('../config/database');

class DeliveryAgent {
    static async findAll() {
        const query = 'SELECT * FROM delivery_agent';
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findById(agent_id) {
        const query = 'SELECT * FROM delivery_agent WHERE agent_id = ?';
        try {
            const [rows] = await db.query(query, [agent_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email_address) {
        const query = 'SELECT * FROM delivery_agent WHERE email_address = ?';
        try {
            const [rows] = await db.query(query, [email_address]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByPhone(phone_number) {
        const query = 'SELECT * FROM delivery_agent WHERE phone_number = ?';
        try {
            const [rows] = await db.query(query, [phone_number]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAvailable() {
        const query = 'SELECT * FROM delivery_agent WHERE is_free = true';
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(agentData) {
        const query = 'INSERT INTO delivery_agent (phone_number, email_address, number_of_trips, is_free, SSN) VALUES (?, ?, ?, ?, ?)';
        try {
            const [result] = await db.query(query, [
                agentData.phone_number,
                agentData.email_address,
                agentData.number_of_trips || 0,
                agentData.is_free !== undefined ? agentData.is_free : true,
                agentData.SSN
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(agent_id, agentData) {
        const query = 'UPDATE delivery_agent SET phone_number = ?, email_address = ?, number_of_trips = ?, is_free = ?, SSN = ? WHERE agent_id = ?';
        try {
            const [result] = await db.query(query, [
                agentData.phone_number,
                agentData.email_address,
                agentData.number_of_trips,
                agentData.is_free,
                agentData.SSN,
                agent_id
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(agent_id, is_free) {
        const query = 'UPDATE delivery_agent SET is_free = ? WHERE agent_id = ?';
        try {
            const [result] = await db.query(query, [is_free, agent_id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(agent_id) {
        const query = 'DELETE FROM delivery_agent WHERE agent_id = ?';
        try {
            const [result] = await db.query(query, [agent_id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAgentWithOrders(agent_id) {
        const query = `
            SELECT da.*, o.order_id, o.order_date, o.total_price, o.status as order_status
            FROM delivery_agent da
            LEFT JOIN orders o ON da.agent_id = o.agent_id
            WHERE da.agent_id = ?
            ORDER BY o.order_date DESC
        `;
        try {
            const [rows] = await db.query(query, [agent_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAgentStats(agent_id) {
        const query = `
            SELECT 
                COUNT(o.order_id) as total_orders,
                SUM(o.total_price) as total_revenue,
                COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as completed_deliveries,
                COUNT(CASE WHEN o.status = 'in_transit' THEN 1 END) as in_progress_deliveries
            FROM delivery_agent da
            LEFT JOIN orders o ON da.agent_id = o.agent_id
            WHERE da.agent_id = ?
        `;
        try {
            const [rows] = await db.query(query, [agent_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DeliveryAgent;
