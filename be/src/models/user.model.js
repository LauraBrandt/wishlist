module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: { type: String, unique: true, required: true },
      // email: { type: String, unique: true, required: true },
      // password: { type: String, required: true },
      list_edit_accesses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'List',
        },
      ],
      list_view_accesses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'List',
        },
      ],
    },
  )

  return mongoose.model('User', schema)
}