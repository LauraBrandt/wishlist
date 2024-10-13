module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: { type: String, required: true },
      owner_id: { type: String, required: true },
      owner_can_view: { type: Boolean, default: false },
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
