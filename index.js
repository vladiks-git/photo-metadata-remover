const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// === CONFIG ===
const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

// какие форматы обрабатывать
const VALID_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// === MAIN ===
async function processFolder() {
    await fs.ensureDir(OUTPUT_DIR);

    const files = await fs.readdir(INPUT_DIR);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();

        if (!VALID_EXT.includes(ext)) continue;

        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        try {
            console.log(`Processing: ${file}`);

            await sharp(inputPath)
                .rotate() // фикс ориентации
                .toFormat('jpeg', { quality: 95 }) // 🔥 пересохранение без метаданных
                .toFile(outputPath);

            console.log(`Saved: ${outputPath}`);
        } catch (err) {
            console.error(`Error: ${file}`, err.message);
        }
    }

    console.log('Done');
}

processFolder();