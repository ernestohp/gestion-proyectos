import { useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

const Cabecera = () => {
    const location = useLocation()
    const pathN = location.pathname
    const pActive = (pathN.startsWith('/proyectos')||pathN==='/')? ' active':''
    const aActive   = (pathN.startsWith('/alertas'))?   ' active':''
    const dActive = (pathN.startsWith('/dashboard'))? ' active':''
    
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#2668A0'}}>

            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className={"nav-link" + pActive} aria-current="page" href="/proyectos">Proyectos</a>
                    <a className={"nav-link" + aActive} href="/alertas">Alertas</a>
                    {/*<a className={"nav-link" + dActive} href="/dashboard">Dashboard</a> */}
                </div>
                </div>
            </div>
            </nav>

        </>
    )
}

export default Cabecera
