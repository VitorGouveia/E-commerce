function handle(err: Error, errorMessage: string) {
  if(err) {
    console.log(err.name)
    throw new Error(errorMessage)
  }
}

export { handle }