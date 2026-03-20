const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// === CONFIG ===
const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

const VALID_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// === MAIN ===
async function processFolder() {
    await fs.ensureDir(OUTPUT_DIR);

    let files = await fs.readdir(INPUT_DIR);

    // стабильный порядок (важно для нумерации)
    files = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    let counter = 1;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!VALID_EXT.includes(ext)) continue;

        const inputPath = path.join(INPUT_DIR, file);
        const outputFileName = `${counter}${ext}`; // 👈 сохраняем расширение
        const outputPath = path.join(OUTPUT_DIR, outputFileName);

        try {
            console.log(`Processing: ${file} → ${outputFileName}`);

            let pipeline = sharp(inputPath).rotate();

            // 👇 сохраняем в исходный формат
            if (ext === '.jpg' || ext === '.jpeg') {
                pipeline = pipeline.jpeg({ quality: 95 });
            } else if (ext === '.png') {
                pipeline = pipeline.png();
            } else if (ext === '.webp') {
                pipeline = pipeline.webp({ quality: 95 });
            }

            await pipeline.toFile(outputPath);

            counter++;
        } catch (err) {
            console.error(`Error: ${file}`, err.message);
        }
    }

    console.log('Done');
}

processFolder();