module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '16',
        },
      },
    ],
  ],
  env: {
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '16',
            },
            modules: 'cjs',
          },
        ],
      ],
    },
    esm: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '16',
            },
            modules: false,
          },
        ],
      ],
    },
  },
}
