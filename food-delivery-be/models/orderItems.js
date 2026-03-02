const db = require('../config/database');

class OrderItems {
    static async findAll() {
        const query = 'SELECT * FROM order_items';
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findById(order_id) {
        const query = 'SELECT * FROM order_items WHERE order_id = ?';
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByOrderId(order_id) {
        const query = 'SELECT * FROM order_items WHERE order_id = ?';
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(orderData) {
        const query = 'INSERT INTO order_items (order_id, item_id, qty) VALUES (?, ?, ?)';
        try {
            const [result] = await db.query(query, [
                orderData.order_id,
                orderData.item_id,
                orderData.qty
            ]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(order_id, orderData) {
        const query = 'UPDATE order_items SET order_id = ?, item_id = ?, qty = ? WHERE item_id = ?';
        try {
            const [result] = await db.query(query, [
                orderData.order_id,
                orderData.item_id,
                orderData.qty,
                order_id
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(order_id, item_id) {
        const query = 'DELETE FROM order_items WHERE order_id = ? AND item_id = ?';
        try {
            const [result] = await db.query(query, [order_id, item_id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getOrderItemsWithDetails(order_id) {
        const query = `
            SELECT oi.*, m.name as item_name, m.description as item_description, m.price as item_price
            FROM order_items oi
            JOIN menu_items m ON oi.item_id = m.menu_item_id
            WHERE oi.order_id = ?
        `;
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getOrderTotal(order_id) {
        const query = `
            SELECT SUM(oi.qty * m.price) as total
            FROM order_items oi
            JOIN menu_items m ON oi.item_id = m.menu_item_id
            WHERE oi.order_id = ?
        `;
        try {
            const [rows] = await db.query(query, [order_id]);
            return rows[0].total || 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = OrderItems;
