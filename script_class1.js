if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',ready)
} else {
    ready()
}

async function ready() {
    const res = await fetch('./list_of_alleles.json')
    const data = await res.json()
    loadBody(data);


    const res_phos = await fetch('./list_of_alleles_phospho.json')
    data_phospho = await res_phos.json()

    await load_phospho(data_phospho)

    alleles.filter(allele => allele.pepLen === 9).forEach(allele =>{
        const line_to_append = document.getElementById(allele.name).getElementsByClassName("Model-Selection")[0]
        const downloadPeptides = document.createElement('a')
        downloadPeptides.href = "#PATH_TO_ADD"
        downloadPeptides.className = "download-allele"
        downloadPeptides.innerText = "Download Peptides"
        line_to_append.appendChild(downloadPeptides)
    })

    phospho_alleles.filter(allele => allele.pepLen === 9).forEach(allele =>{

        const line_to_append = document.getElementById(allele.name).getElementsByClassName("Model-Selection")[0]
        const downloadPeptides = document.createElement('a')
        downloadPeptides.href = "#PATH_TO_ADD"
        downloadPeptides.className = "download-allele"
        downloadPeptides.innerText = "Download PTM Peptides"
        line_to_append.appendChild(downloadPeptides)
    })
    
    const toShowInitial = document.getElementById("checkA0201")
    toShowInitial.checked = true
    LoadHideLogos(toShowInitial)
}

function load_phospho(data_phospho) {
    phospho_alleles = data_phospho.map(allele => {
        // console.log(allele)
        const alleleElementToAddPhospho = document.getElementById(allele.name)
        // title = title[0]
        
        // console.log(title.getElementsByClassName('Model-Selection'))
        // console.log(alleleElement.getElementsByClassName('title')[0].getElementsByClassName('Model-Selection')[0])
        AddModelSelector(modelPTM,allele.name,alleleElementToAddPhospho.getElementsByClassName('title')[0].getElementsByClassName('Model-Selection')[0])
        return { name: allele.name, longName: allele.longName, specificity: allele.specificities, pepLen: allele.pepLen, element: alleleElementToAddPhospho}
    })
}

function loadBody(data) {
    alleles = data.map(allele => {
        const alleleElement = alleleListTemplate.content.cloneNode(true).children[0]
        if (allele.pepLen===9) {
            const span = document.createElement('span')
            span.className = 'custom-check blue'
            const label = document.createElement('label')

            label.appendChild(span)
            label.innerHTML += allele.longName
            // = '<span class="custom-check blue"></span>' + allele.longName
            const idname = "check" + allele.name
            label.htmlFor = idname
            alleleElement.appendChild(label)
            alleleElement.querySelector('input').id = idname
            alleleElement.classList.add(allele.name)
            allelesContainer.append(alleleElement)
            

            // generate templates for alleles shown
            const graphElement = graphsTemplate.content.cloneNode(true).children[0]
            graphElement.querySelector('[title]').innerHTML = allele.longName
            const listOfModels = document.createElement('font')
            listOfModels.className='Model-Selection'
            graphElement.id=allele.name
            const min_len = 8
            const max_len = 14

            // Models.forEach( model => {
            //     AddModelSelector(model,allele.name,listOfModels,checked=true)
            // })

            // const downloadPeptides = document.createElement('a')
            // downloadPeptides.href = "#PATH_TO_ADD"
            // downloadPeptides.className = "download-allele"
            // downloadPeptides.innerText = "Download Peptides"
            
            AddModelSelector(Models[0],allele.name,listOfModels,checked=true)
            AddModelSelector(Models[1],allele.name,listOfModels)
            if (allele.specificities > 1) {
                AddModelSelector(Models[2],allele.name,listOfModels)
            }

            // listOfModels.appendChild(downloadPeptides)
            graphElement.querySelector('[title]').appendChild(listOfModels)

            
            graphsContainer.append(graphElement)
        }
        return { name: allele.name, longName: allele.longName, specificity: allele.specificities, pepLen: allele.pepLen, element: alleleElement}
    })

    document.getElementById("nav-toggle").checked = false
}



const alleleListTemplate = document.querySelector("[data-allele-list-template]")
const allelesSelectedContainer = document.querySelector("[data-alleles-selected-container]")
const allelesContainer = document.querySelector("[data-alleles-container]")
const graphsTemplate = document.querySelector("[data-content-allele-template]")
const graphsContainer = document.querySelector("[data-content-graphs]")
const alleleSearch = document.querySelector("[data-allele-search]")



let alleles = []
let shownAlleles = []
let phospho_alleles = []

//const Models = ['MixMHCpred','MSdata']

const Models = [
    {
        nameID: 'MixMHCpred', nameShown: 'Model', sourceFolderLogos: 'PWMMixMHCpredModel', sourceLendist: 'Peptides_David_multipleSpecificity'
    },
    {
        nameID: 'MSData', nameShown: 'Ligands', sourceFolderLogos: 'Peptides_David_multipleSpecificity', sourceLendist: ''
    },
    {
        nameID: 'MultSpec', nameShown: 'Multiple Specificities', 'sourceFolderLogos': 'Peptides_David_multipleSpecificity', sourceLendist: ''
    }
]

// const ModelMultSpec = {
//     nameID: 'MultSpec', nameShown: 'Multiple Specificities', 'sourceFolderLogos': 'Peptides_David_multipleSpecificity', sourceLendist: ''
// }

const modelPTM = {
    nameID: 'PTM', nameShown: 'PTM Ligands'
}

const PTMModels = [{
    nameID: 'phospho', nameShown: 'Phosphorylated Ligands', sourceFolderLogos: 'Peptides_phospho'
}]


function AddModelSelector(model,alleleName,WhereToAdd,checked=false) {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    const idName = 'check' + alleleName + model.nameID
    checkbox.id = idName
    checkbox.className = 'checkModel'
    if (checked) {
        checkbox.checked = true
    }
    checkbox.addEventListener('click',showHideModel)
    const label = document.createElement('label')
    label.setAttribute('for',idName)
    
    const span2 = document.createElement('span')
    span2.className = 'custom-check black'
    label.appendChild(span2)
    label.innerHTML += model.nameShown
    WhereToAdd.appendChild(checkbox)
    WhereToAdd.appendChild(label)
    // if (model.nameID === "PTM") {
    //     console.log(WhereToAdd)
    // }
}

alleleSearch.addEventListener("input", e => {
    //console.log(document.querySelector("[allele-selector]").addEventListener("click",showStuff()))
    const searchString = e.target.value.toUpperCase()
    alleles.filter( element => element !== undefined
    ).forEach(allele => {
        const isVisible = allele.name.includes(searchString) || allele.longName.includes(searchString)
        allele.element.classList.toggle("hide", !isVisible)
        
    })
})






// window.addEventListener('load', function () {
//     const allModelSelectors=document.querySelectorAll('.checkModel')

//     console.log('first element',allModelSelectors)
//     console.log(Array.from(allModelSelectors))
//     for (const element of Array.from(allModelSelectors)) {
//         console.log('been there done that')
//     }
// })

// Object.keys(allModelSelectors).forEach(name => {
//     console.log(name)
// })

// .forEach((key,name) => {
//     console.log('hi')
// })

function showHideModel(event) {
    const checkbox = event.target
    const allele_name = checkbox.id.substr(5,5)
    const graphContainer = document.getElementById(allele_name)
    const elementToShowHide = graphContainer.getElementsByClassName(checkbox.id.substr(10))[0]
    // console.log(elementToShowHide)
    if (checkbox.checked) {
        elementToShowHide.style.display = 'flex'
        // elementToShowHide.style.opacity = 1
        // elementToShowHide.style.transform = 'scale(1)'
    } else {
        elementToShowHide.style.display = 'none'
        // elementToShowHide.style.transform = 'scale(0)'
        // elementToShowHide.style.opacity = 0
    }
}

function LoadHideLogos(selectorElement,min_len=8,max_len=14) {
    id_allele = selectorElement.id
    const allele = id_allele.substr(5)
    alleleBlock = document.getElementById(allele)
    // console.log(alleleBlock.querySelector('[data-allele-graphs').innerText)
    if (document.getElementById(id_allele).checked) {
        alleleBlock.style.display = "block"
        shownAlleles.push(allele)
        if (alleleBlock.querySelector('[data-allele-graphs').innerHTML === '') {

            alleleBlock.querySelector('[data-allele-graphs]').appendChild(writeHTMLalleleModel(allele,Models[0]))
            alleleBlock.querySelector('[data-allele-graphs]').appendChild(writeHTMLalleleModel(allele,Models[1]))
            
            const allele_len9 = alleles.filter(new_allele => new_allele.name === allele && new_allele.pepLen === 9)[0]
            if (allele_len9.specificity > 1 ){
                alleleBlock.querySelector('[data-allele-graphs]').appendChild(writeHTMLalleleModel(allele,Models[2],multSpec=true))
            }


            // add phospho motif
            const phospho_characteristics = phospho_alleles.filter(element => element.name === allele)
            // console.log(allele)
            phospho_characteristics.forEach(phospho_characteristic => {
                
                const listOfFigures = document.createElement('ul')
                listOfFigures.className = modelPTM.nameID
                if (!document.getElementById("check"+allele+modelPTM.nameID).checked) {
                    listOfFigures.style.display = 'none'
                }

                //line description
                const TitleLeft = document.createElement('li')
                TitleLeft.className = 'title-model'
                var spanInTitle = document.createElement('span')
                spanInTitle.innerHTML = modelPTM.nameShown
                TitleLeft.appendChild(spanInTitle)
                listOfFigures.appendChild(TitleLeft)
            
                const lenDist = document.createElement('li')
                if (!document.getElementById('checkLenDist').checked) {
                    listOfFigures.style.display = 'none'
                }
                PTMModels.forEach(model => {
                    var li = document.createElement('li')
                    li.id = modelPTM.nameID+allele+model.nameID
                    var title = document.createElement('p')
                    title.className = 'figName'
                    title.innerHTML = model.nameShown
                    li.appendChild(title)
                    li.appendChild(createNlogos(model.sourceFolderLogos + '/class1_9/Logos/' + allele,phospho_characteristic.specificity))
                    listOfFigures.appendChild(li)
                })
                alleleBlock.querySelector('[data-allele-graphs]').appendChild(listOfFigures)
            })


        }
        selectorElement.parentElement.parentElement.removeChild(selectorElement.parentElement)
        addInSorted(allelesSelectedContainer,selectorElement.parentElement)
    } else {
        alleleBlock.style.display = 'none'
        const index = shownAlleles.indexOf(allele)
        shownAlleles.splice(index,1)
        selectorElement.parentElement.parentElement.removeChild(selectorElement.parentElement)
        addInSorted(allelesContainer,selectorElement.parentElement)

    }
}


function writeHTMLalleleModel(allele,model,multSpec=false,min_len=8,max_len=14) {
    const listOfFigures = document.createElement('ul')
    listOfFigures.className = model.nameID

    // console.log('check'+allele+model.nameID)
    if (!document.getElementById("check"+allele+model.nameID).checked) {
        listOfFigures.style.display = 'none'
    }

    // line description
    const TitleLeft = document.createElement('li')
    TitleLeft.className = 'title-model'
    var spanInTitle = document.createElement('span')
    spanInTitle.innerHTML = model.nameShown
    TitleLeft.appendChild(spanInTitle)
    listOfFigures.appendChild(TitleLeft)

    const lenDist = document.createElement('li')
    if (!document.getElementById('checkLenDist').checked) {
        listOfFigures.style.display = 'none'
    }


    // various pep len
    for (var pep_len = min_len;pep_len<=max_len;pep_len++) {
        var li = document.createElement('li')
        li.id = model.nameID+allele+pep_len
        if (!document.getElementById("check"+pep_len).checked) {
            li.style.display = 'none'
        }
        var specificity = alleles.filter(newAllele => {
            return newAllele.name === allele && newAllele.pepLen === pep_len
            })[0].specificity
        var title = document.createElement('p')
        title.className = 'figName'
        // title.innerHTML = pep_len + ' mer'
        li.appendChild(title)
        li.appendChild(createNlogos(model.sourceFolderLogos + '/class1_' + pep_len + '/Logos/' + allele,specificity,multSpec=multSpec))
        listOfFigures.appendChild(li)
    }
    
    // len dist
    const liLenDist = document.createElement('li')
    liLenDist.id=model.nameID+allele+'LenDist'
    // liLenDist.className = "lenDist"
    if (model.sourceLendist != '') {
        const linkToLenDist = document.createElement('a')
        linkToLenDist.href = model.sourceLendist + '/len_dists/' + allele + '.png'
        linkToLenDist.target = '_blank'
        var fig_title = document.createElement('p')
        fig_title.className = 'figName'
        fig_title.innerText = "Peptide Length Distribution"
        linkToLenDist.appendChild(fig_title)
        
        const logo = document.createElement('div')
        logo.className = 'logos'
        const lenDistImg = document.createElement('img')
        lenDistImg.src = model.sourceLendist + '/len_dists/' + allele + '.png'
        lenDistImg.style.width = '250px'
        logo.appendChild(lenDistImg)
        linkToLenDist.appendChild(logo)
        liLenDist.appendChild(linkToLenDist)
        listOfFigures.appendChild(liLenDist)
    }
    
    
    return listOfFigures
}


function createNlogos(imageSource,spec,multSpec=false) {
    var logo = document.createElement('div')
    logo.className = 'logos'

    var image_name = ''
    // for (var specificity = 1; specificity<=spec; specificity++) {
    //     image_name = imageSource + '_' + specificity + '.png'
        
    //     var reference = document.createElement('a')
    //     reference.href = image_name
    //     var img = document.createElement('img')
    //     img.src = image_name
    //     if (spec <= 1){
    //         img.style.width='250px'
    //     } else {
    //         img.style.width='125px'
    //         img.className = 'smallImg'
    //     }
    //     reference.appendChild(img)
    //     logo.appendChild(reference)
    // }

    if (multSpec && spec >1){
        for (var specificity = 1; specificity<=spec; specificity++) {
            image_name = imageSource + '_' + specificity + '.png'
            
            var reference = document.createElement('a')
            reference.href = image_name
            var img = document.createElement('img')
            img.src = image_name
            img.style.width='125px'
            img.className = 'smallImg'
            reference.appendChild(img)
            logo.appendChild(reference)
        }
    }
    else{
        image_name = imageSource + '.png'
        var reference = document.createElement('a')
        reference.href = image_name
        var img = document.createElement('img')
        img.style.width='250px'
        img.src = image_name
        reference.appendChild(img)
        logo.appendChild(reference)    }
    return logo
}

function showHideElement(idname) {
    var checkBox = document.getElementById("check"+idname);
    var text = document.getElementById(idname);
    if (checkBox.checked == true){
        text.style.display = "flex"
    } else {
        text.style.display = "none"
    }
}



function updateLengthsShown(pep_len) {
    const toShow = (document.getElementById('check'+pep_len).checked)

    shownAlleles.forEach(allele => {
        Models.forEach(model => {
            figure=document.getElementById(model.nameID+allele+pep_len)
            if (figure) {
                if (toShow) {
                    figure.style.display="block"
                }
                else {
                    figure.style.display="none"
                }
            }
        })
    })
}


function uncheckAll() {
    while (allelesSelectedContainer.getElementsByTagName('li').length != 0) {
        elementTohide = allelesSelectedContainer.getElementsByTagName('li')[0].getElementsByTagName('input')[0]
        // console.log(elementTohide)
        elementTohide.checked = false
        LoadHideLogos(elementTohide)
    }

    // while (shownAlleles.length != 0) {
    //     elementTohide = document.getElementById('check'+shownAlleles[0])
    //     elementTohide.checked = false
    //     LoadHideLogos(elementTohide.id)
    // }
}




function addInSorted(ul,newLi) {
    all_li=ul.getElementsByTagName("li")
    newClassName=newLi.classList[1]
    if (all_li.length === 0 || all_li[all_li.length-1].classList[1] < newClassName) {
        ul.appendChild(newLi)
    }
    else {
        var start = 0
        var end = all_li.length-1
        while(end-start > 0) {
            new_index = Math.floor((end+start)/2)

            classToCompare=all_li[new_index].classList[1]
            if (classToCompare < newClassName) {
                start = new_index+1
            }
            else {
                end = new_index
            }
        }
        ul.insertBefore(newLi,all_li[start])
    }
}

// function writeDefaultAllele(allele,min_len=8,max_len=14){
//     // options for this allele (different lengths and length distribution)
//     var text = "<h2>" + longname(allele);
//     text+="<font size=4>"
//     for (var pep_len=min_len;pep_len<=max_len;pep_len++){
//         text+='<input type="checkbox" id="check' + allele + pep_len+'" onclick="showHideElement(\''+ allele +  pep_len + '\')"';
//         if (pep_len==9){
//             text+=" checked"
//         }
//         text+='>';
//         text+='<label for="check' + allele + pep_len + '">' + pep_len + " mer</label>"
//     }
//     text+='<input type="checkbox" id="check' + allele + 'lendist" checked><label for="check' + allele + pep_len + '">' + 'Length Distribution</label>';
//     text+="</font>"+ "</h2>";

//     // Logos for each peptide length

//     for (var pep_len=min_len;pep_len<=max_len;pep_len++){
//         text+='<div id ="' + allele + pep_len + '" ';

//         if (pep_len!=9) {
//             text+=' style="display:none"';
//         }
//         text+='>';

//         // Data
        
//         text+='<ul><li><p class="figName">Mass Spectrometry Data</p><a href="Peptides_David/class1_'+ pep_len + '/Logos/' + allele + '.png" target="_bklank">';
//         text+='<img src="Peptides_David/class1_' + pep_len + '/Logos/' + allele + '.png" width=250></a>';

//         // predictions

//         for (threshold of thresholds) {
//             text+='<li><pclass="figName">Predictions for top ' + threshold*100 + ' %</p>'
//             text+='<a href="predictions_' + threshold + '/' + pep_len + 'mer/Logos/' + allele + '.png" target="_blank">'
//             text+='<img src="predictions_' + threshold + '/' + pep_len + 'mer/Logos/' + allele + '.png" width=250></a>'

//             text+='</li>'
//         }

//         // add motif in Model

//         text+='</ul>';
//         text+='</div>';
//     }

//     return text;
// }