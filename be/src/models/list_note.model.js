module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: String,
    },
  )

  return mongoose.model('ListNote', schema)
}