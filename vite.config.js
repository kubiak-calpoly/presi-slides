export default {
  build: {
    outDir: "includes",
    lib: {
      entry: ['src/index.js'],
      fileName: "presi-slides",
      formats: ['es', 'cjs']
    }
  }
}
