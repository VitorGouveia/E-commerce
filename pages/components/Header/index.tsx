const Header = ({ page }) => {
  return(
    <header>
      <div className="page-info">
        <h1>{page}</h1>
        <input type="text" placeholder="pesquise" />
      </div>

      <div className="user-info">
        <p>User</p>
        <div className="user-pic"></div>
      </div>
    </header>
  )
}

export { Header }