module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
      },
      user_id: { type: Number, required: true },
      user_name: { type: String },
      text: String,
    },
  )

  return mongoose.model('ListNote', schema)
}