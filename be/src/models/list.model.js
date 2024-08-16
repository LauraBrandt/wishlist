module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: { type: String, required: true },
      items: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ListItem',
        },
      ],
      notes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ListNote',
        },
      ],
    },
  )

  return mongoose.model('List', schema)
}
