const FootballStandinsAPIEndpoint = "https://api-football-standings.azharimm.site";
const SpotifyTokenEndpoint = "https://accounts.spotify.com/api/token";
const SpotifyDataEndpoint = "https://api.spotify.com/v1";

const SpotifyIDPodcastRaccontiRossoneri = "6qoIcA2MZG1YvMVei4ZfjW";  //recuperato tramite APP Spotify

const clientID = "12eb0a5fb33846cab7cc3a8c14974686";
const clientSecret = "8abdc25ca5e5414090af9456f132713e";

let token; //VARIABILE GLOBALE PER IL TOKEN

function createImage (src_image) {
    const image = document.createElement("img");
    image.src = src_image;
    return image;
}

function onEpisodeClick(event) {
    const episodio = event.currentTarget;
    const episodio_img = episodio.querySelector("img");
    const image = createImage(episodio_img.src);
    document.body.classList.add('no_scroll');
    modalView.style.top = window.pageYOffset + 'px';  //modalView è una variabile globale
    modalView.appendChild(image);
    //prelevo l'ultimo elemento dal vettore posto come valore della mappa, cioè la descrizione
    const descrizione = mappa_src_descrizione[episodio_img.src][1];
    const blocco_des = document.createElement("p");
    blocco_des.textContent = descrizione;
    modalView.appendChild(blocco_des);
    //prelevo il primo elemento dal vettore posto come valore della mappa, cioè il link
    const link = mappa_src_descrizione[episodio_img.src][0];
    const elemento_link = document.createElement("a");
    elemento_link.href = link;
    elemento_link.textContent = "Clicca qui per ascoltare l'episodio su Spotify";
    modalView.appendChild(elemento_link);
    modalView.classList.remove("hidden");
}

function chiudiModale(event) {
    if (event.key === 'Escape') {
        document.body.classList.remove("no_scroll");
        modalView.classList.add("hidden");
        modalView.innerHTML = '';
    }
}

function onStandingsJson(json) {
    //svuoto la classifica (lasciando la prima barra visibile)
    const sezioneClassifica = document.querySelector("#classifica");
    const div_Squadra = sezioneClassifica.querySelectorAll('div');
    for (blocco of div_Squadra) {
        blocco.innerHTML = '';
    }

    //stampo in console l'oggetto ritornato
    console.log(json);

    //itero 20 volte poichè le squadre di Serie A sono 20 (anche l'array standings ha dimensione 20)
    for(let i=0;i<20;i++) {

        const squadra = json.data.standings[i];
        const nome_squadra = squadra.team.abbreviation
        const logo = squadra.team.logos[0].href;
        const numeroPartite = squadra.stats[3].value;
        const numVittorie = squadra.stats[0].value;
        const numSconfitte = squadra.stats[1].value;
        const numPareggi = squadra.stats[2].value;
        const golFatti = squadra.stats[4].value;
        const golSubiti = squadra.stats[5].value;
        const diffGoal = squadra.stats[9].value;
        const punti = squadra.stats[6].value;

        const div_Squadra = document.createElement('div');
        const span_Nome_Logo = document.createElement('span');
        const span_Stats = document.createElement('span');

        //inserisco la posizione accanto al logo
        const pos = document.createElement('a');
        pos.textContent = i+1;
        span_Nome_Logo.appendChild(pos);

        const img_logo = document.createElement('img');
        img_logo.src = logo;
        span_Nome_Logo.appendChild(img_logo);

        const name = document.createElement('a');
        name.textContent = nome_squadra;
        span_Nome_Logo.appendChild(name);

        const PG = document.createElement('a');
        PG.textContent = numeroPartite;
        span_Stats.appendChild(PG);

        const V = document.createElement('a');
        V.textContent = numVittorie;
        span_Stats.appendChild(V);

        const S = document.createElement('a');
        S.textContent = numSconfitte;
        span_Stats.appendChild(S);

        const P = document.createElement('a');
        P.textContent = numPareggi;
        span_Stats.appendChild(P);

        const GF = document.createElement('a');
        GF.textContent = golFatti;
        span_Stats.appendChild(GF);

        const GS = document.createElement('a');
        GS.textContent = golSubiti;
        span_Stats.appendChild(GS);

        const DG = document.createElement('a');
        DG.textContent = diffGoal;
        span_Stats.appendChild(DG);

        const PT = document.createElement('a');
        PT.textContent = punti;
        span_Stats.appendChild(PT);

        div_Squadra.appendChild(span_Nome_Logo);
        div_Squadra.appendChild(span_Stats);
        sezioneClassifica.appendChild(div_Squadra);

    }


}

function onResponse(response) {
    return response.json();
}

function onTokenResponse(response) {
    return response.json();
}

function onTokenJson(json) {
    token = json.access_token;
    richiedi();  //tale funzione effettua la fetch per ricevere i dati sugli episodi cercati
}


//Implemento una mappa che associa ad ogni src immagine ottenuta dal server la descrizione ad essa relativa
 const mappa_src_descrizione = {};

function onEpisodesJson(json) {
    //stampo in console l'oggetto ritornato
    console.log(json);
    
    //scelgo di recuperare ad ogni chiamata solo i 12 episodi più recenti (occupano le prime posizioni dell'array)
    const arrayEpisodi = json.items;
    for(let i=0;i<12;i++) {

        const immagine_src = arrayEpisodi[i].images[1].url;  //prendo l'immagine a dimensioni medie (height: 300)
        const nomeEpisodio = arrayEpisodi[i].name;
        const data = arrayEpisodi[i].release_date;

        //servono per la vista modale
        const listaValoriMappa = []; 
        const descrizione = arrayEpisodi[i].description; 
        const url_esterno = arrayEpisodi[i].external_urls.spotify;
        listaValoriMappa.push(url_esterno);
        listaValoriMappa.push(descrizione);
         //inserisco nella mappa la coppia (key = src_immagine; value = array[descrizione,url_esterno])
        mappa_src_descrizione[immagine_src] = listaValoriMappa; 

        const sezioneEpisodi = document.querySelector("#episode_view");

        const div_Episodio = document.createElement('div');

        const immagine = document.createElement('img');
        immagine.src = immagine_src;
        div_Episodio.appendChild(immagine);

        const span_Nome_episodio = document.createElement('span');
        span_Nome_episodio.classList.add('ep_name');
        span_Nome_episodio.textContent = nomeEpisodio;
        div_Episodio.appendChild(span_Nome_episodio);

        const span_data = document.createElement('span');
        span_data.classList.add('data_rilascio');
        span_data.textContent = data;
        div_Episodio.appendChild(span_data);
        div_Episodio.addEventListener('click',onEpisodeClick);

        sezioneEpisodi.appendChild(div_Episodio);

    }
}

function richiedi() {
    //fetch per la ricerca degli episodi del podcast
    const url_fetch_podcast = SpotifyDataEndpoint + "/shows/" + SpotifyIDPodcastRaccontiRossoneri + "/episodes?market=IT";
    fetch(url_fetch_podcast,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(onResponse).then(onEpisodesJson);
}

//nessuna autorizzazione richiesta per Football Standings API
const url_fetch_classifica = FootballStandinsAPIEndpoint + "/leagues/ita.1/standings?season=2021&sort=asc"
fetch(url_fetch_classifica).then(onResponse).then(onStandingsJson);

//fetch per l'ottenimento del token OAuth 2.0 per Spotify API
fetch(SpotifyTokenEndpoint,
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
        }
    }
).then(onTokenResponse).then(onTokenJson);

//esco dalla modale quando premo tasto ESC
const modalView = document.querySelector("#modal_view");
window.addEventListener('keydown', chiudiModale);


