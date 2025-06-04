const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Статические файлы
app.use(express.static('.'));

// Путь к файлу данных
const DATA_FILE = path.join(__dirname, 'data.json');

// Загрузка данных
app.get('/load-data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Если файл не существует, создаем его с начальными данными
            const initialData = {
                users: {},
                theme: 'light',
                selectedTab: null
            };
            await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
            res.json(initialData);
        } else {
            console.error('Error loading data:', error);
            res.status(500).json({ error: 'Failed to load data' });
        }
    }
});

// Сохранение данных
app.post('/save-data', async (req, res) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 