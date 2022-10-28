module.exports = {
  module: {
    noParse: /(mapbox-gl)\.js$/,
  },

vendor: [
  
  'xlsx',
  'file-saver'
],

node: {fs: 'empty'},
externals: [
{'./cptable': 'var cptable'},
{'./jszip': 'jszip'}
]
};
