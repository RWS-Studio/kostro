// utilities

let copy=(e,text)=>{
    e.preventDefault();
    navigator.clipboard.writeText(text).then(()=>{
        alert("Copied : "+text);
    })
}

function shareWithEmail(link){
    const url = new URL(link);
    let website = url.searchParams.get("website");
    window.open("mailto:?subject=Here are some informations about "+website+"!&body=There is a lot of informations about "+website+" at "+window.location);
}