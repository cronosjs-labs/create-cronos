const defaultController = async (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  })
}

export { defaultController }
