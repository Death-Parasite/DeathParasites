const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function fetchModel() {
  const dir = path.join(__dirname, 'public', 'assets', 'model');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  // URLs from PolyHaven API for pipe_wrench 2k GLTF
  const files = {
    'pipe_wrench_2k.gltf': 'https://dl.polyhaven.org/file/ph-assets/Models/gltf/2k/pipe_wrench/pipe_wrench_2k.gltf',
    'pipe_wrench_2k.bin': 'https://dl.polyhaven.org/file/ph-assets/Models/gltf/2k/pipe_wrench/pipe_wrench_2k.bin',
    'textures/pipe_wrench_diff_2k.jpg': 'https://dl.polyhaven.org/file/ph-assets/Models/jpg/2k/pipe_wrench/pipe_wrench_diff_2k.jpg',
    'textures/pipe_wrench_rough_2k.jpg': 'https://dl.polyhaven.org/file/ph-assets/Models/jpg/2k/pipe_wrench/pipe_wrench_rough_2k.jpg',
    'textures/pipe_wrench_metal_2k.jpg': 'https://dl.polyhaven.org/file/ph-assets/Models/jpg/2k/pipe_wrench/pipe_wrench_metal_2k.jpg',
    'textures/pipe_wrench_nor_gl_2k.jpg': 'https://dl.polyhaven.org/file/ph-assets/Models/jpg/2k/pipe_wrench/pipe_wrench_nor_gl_2k.jpg'
  };

  const texDir = path.join(dir, 'textures');
  if (!fs.existsSync(texDir)){
    fs.mkdirSync(texDir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(files)) {
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, path.join(dir, filename));
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Failed ${filename}`, e);
    }
  }
}

fetchModel();
