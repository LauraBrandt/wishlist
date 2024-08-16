module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
      },
      name: String,
      description: String,
      is_bought: Boolean,
    },
  )

  return mongoose.model('ListItem', schema)
}