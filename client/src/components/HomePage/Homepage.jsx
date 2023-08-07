import estilos from './Homepage.module.css'
import Juegos from '../Juegos/Juegos'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { get_cards, get_by_name,sort_games,get_genres, filter_gender, filter_origin} from '../../redux/actions/actions';
import { Link } from 'react-router-dom';

const PER_PAGE = 15;


export default function Homepage() {

    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const genres = useSelector(state => state.genres)
    const filtered = useSelector(state => state.filtered)

    const game = useSelector(state => state.juegos)
    const gameQuantity = game.length;
    const lastInPage = PER_PAGE * page;
    const firstInPage = lastInPage - PER_PAGE;
    const currentGames = game.slice(firstInPage, lastInPage);
    
    useEffect(() => {
        dispatch(get_cards());
        dispatch(get_genres());
    }, []);

    const[name,setName] = useState({
        game  : '',
    })

    const handleChange = (event) => {
        setName({...name, [event.target.name] : event.target.value})
    }

    const gamesByName = useSelector((state) => state.byName);
    

    useEffect(() => {
        if (name.game !== '') {
          dispatch(get_by_name(name.game));
        }
      }, [name.game]);
    
    const handleSort = (event) => {
        dispatch(sort_games(event.target.name))
    }

    const handleGenreChange = event => {
        const selectedGenre = event.target.value;
        dispatch(filter_gender(selectedGenre));
    };

    const handleOrigin = (event) => {
        const selectedOrigin = event.target.value
        dispatch(filter_origin(selectedOrigin))
    }
    

    return (
        <>
            <div className={estilos.todo}>
            { name.game === '' ?  <div className={estilos.juegos}>
                        { currentGames?.map(juego => {
                            
                            let juegoCambiado = {...juego}
                            if(juego.hasOwnProperty('Genres')){
                                juegoCambiado = {...juego, genres: juego.Genres}
                            }
                         return (
                             <Juegos key={juegoCambiado.id} id={juegoCambiado.id} name={juegoCambiado.name} genres={juegoCambiado.genres} imagen={juegoCambiado.background_image}/>
                            )
                        })}
                    <div className={estilos.btnContainer}> 
                        <button className={`${estilos.btnPaginas} ${ page === 1 ? estilos.disabledBtn : ''}`} disabled={page===1} onClick={() => setPage(page-1)}>ANTERIOR</button>
                        <button className={`${estilos.btnPaginas} ${ page === Math.ceil(gameQuantity/PER_PAGE) ? estilos.disabledBtn : ''}`} disabled={page === Math.ceil(gameQuantity/PER_PAGE)} onClick={() => setPage(page+1)}>POSTERIOR</button>
                    </div>
                    
                </div> : <div className={estilos.juegos}> 
                { gamesByName?.map( juego=> {
                    let juegoCambiado = {...juego}
                    if(juego.hasOwnProperty('Genres')){
                        console.log('entre')
                        juegoCambiado = {...juego, genres: juego.Genres}
                    }
                    return (
                    <Juegos key={juego.id} id={juego.id} name={juego.name} genres={juegoCambiado.genres} imagen={juego.background_image}/>)
                })}
                </div>
            }
                <div className={estilos.filtrado}> 
                    <input type='text' name='game' value={name.game} onChange={handleChange} className={estilos.input} placeholder='Ingresar busqueda'></input>
                    <p className={estilos.subtitulo}>Ordenar: </p> 
                    <button onClick={handleSort} name="A" className={estilos.boton}> Ascendente </button>
                    <button onClick={handleSort} name="D" className={estilos.boton}> Descendente </button>
                    <button onClick={handleSort} name="RA" className={estilos.boton}> Mayor rating </button>
                    <button onClick={handleSort} name="RD" className={estilos.boton}> Menor rating </button>

                    <p className={estilos.subtitulo}>Filtrados: </p> 
                        <select onChange={handleGenreChange}className={estilos.boton}>
                        <option disabled selected> GENERO </option>
                        <option key="todos" value="todos"> Todos </option>

                            {genres?.map((genero) => (
                            <option key={genero.id} value={genero.name}>
                                {genero.name}
                            </option>
                            ))}
                        </select>
                    
                        <select className={estilos.boton}>
                        <option disabled selected> ORIGEN </option>
                        <option onClick={handleOrigin}value="todos"> Todos</option>
                        <option onClick={handleOrigin}value="DB"> BDD</option>
                        <option onClick={handleOrigin}value="API" > API</option>
                        </select>
                        <button className={estilos.boton}><Link to="/form">Agregar juego</Link></button>
                        

                </div>
            </div>
        </>
    )
}