// get json of all schools in the list

// to get the data, the script will try to get the json of <domain>/kostro/infos.json
// if exists -> OK else return ERROR

/* list of different json files (contained in <domain>/kostro/)
   - config.json (required) : configuration of other datas json files : contains the list of available files
   - updates.json (required) : contains why, date, files updated & updater's contact info of all updates of any file of the /kostro/

   - infos.json : school's information
   - open-days.json : school's open-days informations
   - formations.json : school's formations informations
 */

let schools_list_index = [];

// html elements
let form = document.querySelector("#js-form"),  // home page
    form_input = document.querySelector("#js-form-input"),
    form_add = document.querySelector("#js-form-add"),
    form_submit = document.querySelector("#js-form-submit"),
    schools_list_box = document.querySelector("#js-list"),
    // output page
    h3_school_domain = document.querySelector("#js-school-domain"),
    title_website = document.querySelector("#js-title-website"),
    output_data_box = document.querySelector("#js-output-data"),
    previous_school_link = document.querySelector("#js-previous-school"),
    next_school_link = document.querySelector("#js-next-school"),
    datas_type_form = document.querySelector("#js-datas-type-form"),
    datas_type_infos = document.querySelector("#js-datas-type-infos"),
    datas_type_formations = document.querySelector("#js-datas-type-formations"),
    datas_type_open_days = document.querySelector("#js-datas-type-open-days"),
    datas_type_updates = document.querySelector("#js-datas-type-updates");


// index

function addSchoolToList(){
    let website = form_input.value;
    schools_list_index.push(website);
    let new_li = document.createElement("li");
    new_li.textContent = website;
    schools_list_box.append(new_li);
}

function sendForm(schools_list){
    // uses localStorage to stock the schools list
    localStorage.removeItem('websites_list');
    localStorage.setItem('websites_list', schools_list);
    window.location.href = "output.html?website="+schools_list[0]+"&index=0";
}

function index_view(){
    console.log(schools_list_index)
    form_add.addEventListener("click", () => {
        addSchoolToList();
    })
    form_submit.addEventListener("click", () => {
        sendForm(schools_list_index);
    })
}



// output

function setPreviousAndNextLinks(){
    const url = new URL(window.location.href);
    let websites = localStorage.getItem('websites_list').split(','),
        index = new Number(url.searchParams.get('index'));

    console.log(websites.length)
    
    // both conditions can't be in a if...else
    if(websites[index-1] != undefined){
        previous_school_link.setAttribute("href", "output.html?website="+websites[index-1]+"&index="+(index-1));
    }
    if(websites[index+1] != undefined){
        console.log("hi")
        next_school_link.setAttribute("href", "output.html?website="+websites[index+1]+"&index="+(index+1));
    }
}

function showDatas(school_datas){
    data_box = document.createElement("p");
    if(school_datas[0] == "error"){
        data_box.innerHTML = "This school doesn't configured its datas for kostro.";
    }
    else{
        data_box.innerText = school_datas;
        datas_type_updates.removeAttribute("disabled");
    }
    output_data_box.append(data_box);
}

function getSchoolDatas(website, index, type){
    let jsonFilePath = "kostro/"+type+".json",
        jsonDataAbsolutePath = "http://",  // some schools don't have a https website
        school_datas = [],
        websites = localStorage.getItem('websites_list');

    // if user puts <website>/
    if(website[-1] == "/"){
        jsonDataAbsolutePath+=website+jsonFilePath;
    }else{
        jsonDataAbsolutePath+=website+"/"+jsonFilePath;
    }
    
    fetch(jsonDataAbsolutePath)
    .then(response => response.json())
    .then(json => {
        school_datas = json;
        showDatas(school_datas);
    })
    .catch(error => {
        console.log("Kostro Error : "+error);
        school_datas = ["error"];
        showDatas(school_datas);
    });
}

function output_view(){
    const url = new URL(window.location.href); 
    let website = url.searchParams.get('website'),
        index = new Number(url.searchParams.get('index')),  // get the school's domain
        school_config = [],
        configFile = "http://"+website+"/kostro/config.json";
    var opts = {
            headers: {
              'mode':'cors'
            }
        };

    fetch(configFile, opts)
    .then(response => response.json())
    .then(json => {
        school_config = json;
        
        if("infos" in school_config["files"]){
            datas_type_infos.removeAttribute("disabled");
        }
        if("open-days" in school_config["files"]){
            datas_type_open_days.removeAttribute("disabled");
        }
        if("formations" in school_config["files"]){
            datas_type_formations.removeAttribute("disabled");
        }
    })
    .catch(error => {
        console.error("Kostro Error : "+error);
        school_config = ["error"];
    });

    h3_school_domain.innerText = website;
    setPreviousAndNextLinks();
    datas_type_infos.addEventListener("click", () => {
        getSchoolDatas(website, index, "infos");
    })
    datas_type_formations.addEventListener("click", () => {
        getSchoolDatas(website, index, "formations");
    })
    datas_type_open_days.addEventListener("click", () => {
        getSchoolDatas(website, index, "open-days");
    })
    datas_type_updates.addEventListener("click", () => {
        getSchoolDatas(website, index, "updates");
    })
}
