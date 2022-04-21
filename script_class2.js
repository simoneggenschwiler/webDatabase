if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',ready)
} else {
    ready()
}

async function ready() {


    const res = await fetch('./list_of_alleles_classII_common.json')
    const allelesCommon = await res.json()
    document.getElementById("nav-toggle").checked = false

    const resFull = await fetch('./list_of_alleles_classII.json')
    const dataFull = await resFull.json()

    allelesFull = await loadBody(dataFull,show=false,common=allelesCommon)

    showHideKeyword("common",true)

    var toShowInitial = document.getElementById("checkDRB1_01_01")
    toShowInitial.checked = true
    LoadHideLogos(toShowInitial.id)

    toShowInitial = document.getElementById("checkDRB1_04_01")
    toShowInitial.checked = true
    LoadHideLogos(toShowInitial.id)
    // allelesFull = dataFull.map(allele => {
    //     const alleleElement = alleleSelectedTemplate.content.cloneNode(true).children[0]
    //     const span = document.createElement('span')
    //     span.className = 'custom-check blue'
    //     const label = document.createElement('label')

    //     label.appendChild(span)
    //     label.innerHTML += allele.name
    //     // = '<span class="custom-check blue"></span>' + allele.longName
    //     const idname = "selected" + allele.name
    //     label.htmlFor = idname
    //     alleleElement.appendChild(label)
    //     alleleElement.querySelector('input').id = idname
    //     alleleElement.classList.toggle("hide",true)
    //     allelesSelectedContainer.appendChild(alleleElement)
    //     allele.element = alleleElement
    //     return allele
    // })

    // allelesFull = dataFull.map( allele => {
    //     return {}
    // })



    // const res_phos = await fetch('./list_of_alleles_phospho.json')
    // data_phospho = await res_phos.json()

    // load_phospho(data_phospho)

    // alleles.filter(allele => allele.pepLen === 9).forEach(allele =>{

    //     const line_to_append = document.getElementById(allele.name).getElementsByClassName("Model-Selection")[0]
    //     const downloadPeptides = document.createElement('a')
    //     downloadPeptides.href = "#PATH_TO_ADD"
    //     downloadPeptides.className = "download-allele"
    //     downloadPeptides.innerText = "Download Peptides"
    //     line_to_append.appendChild(downloadPeptides)
    // })

    // phospho_alleles.filter(allele => allele.pepLen === 9).forEach(allele =>{

    //     const line_to_append = document.getElementById(allele.name).getElementsByClassName("Model-Selection")[0]
    //     const downloadPeptides = document.createElement('a')
    //     downloadPeptides.href = "#PATH_TO_ADD"
    //     downloadPeptides.className = "download-allele"
    //     downloadPeptides.innerText = "Download PTM Peptides"
    //     line_to_append.appendChild(downloadPeptides)
    // })

}




const alleleListTemplate = document.querySelector("[data-allele-list-template]")
const allelesContainer = document.querySelector("[data-alleles-container]")
const allelesSelectedContainer = document.querySelector("[data-alleles-selected-container]")
const graphsTemplate = document.querySelector("[data-content-allele-template]")
const graphsContainer = document.querySelector("[data-content-graphs]")
const alleleSearchAlpha = document.querySelector("[data-allele-search-alpha]")
const alleleSearchBeta = document.querySelector("[data-allele-search-beta]")


function loadBody(data,show,common) {
    const commonNames = common.map(allele => allele.name)
    return data.map(allele => {
        // console.log(allele)
        const alleleElement = alleleListTemplate.content.cloneNode(true).children[0]
        const span = document.createElement('span')
        span.className = 'custom-check blue'
        const label = document.createElement('label')

        label.appendChild(span)
        label.innerHTML += allele.nameScientific
        // = '<span class="custom-check blue"></span>' + allele.longName
        const idname = "check" + allele.name
        label.htmlFor = idname
        alleleElement.appendChild(label)
        alleleElement.querySelector('input').id = idname
        document.getElementById(allele.name.substring(0,3)).append(alleleElement)
        

        // generate templates for alleles shown
        // const graphElement = graphsTemplate.content.cloneNode(true).children[0]
        // graphElement.querySelector('[title]').innerHTML = allele.longName
        // const listOfModels = document.createElement('font')
        // listOfModels.className='Model-Selection'
        // graphElement.id=allele.name
        // const min_len = 8
        // const max_len = 14

        // Models.forEach( model => {
        //     AddModelSelector(model,allele.name,listOfModels,checked=true)
        // })

        // const downloadPeptides = document.createElement('a')
        // downloadPeptides.href = "#PATH_TO_ADD"
        // downloadPeptides.className = "download-allele"
        // downloadPeptides.innerText = "Download Peptides"
        

        // AddModelSelector(Models[0],allele.name,listOfModels,checked=true)
        // AddModelSelector(Models[1],allele.name,listOfModels)
        // // listOfModels.appendChild(downloadPeptides)
        // graphElement.querySelector('[title]').appendChild(listOfModels)

        
        // graphsContainer.append(graphElement)
        allele.element = alleleElement
        alleleElement.classList.add(idname)
        if (commonNames.includes(allele.name)) {
            alleleElement.classList.add("common")
        }
        allele.element.classList.toggle("hide",!show)
        return allele
    })
}

alleleSearchAlpha.addEventListener("input", e => {
    //console.log(document.querySelector("[allele-selector]").addEventListener("click",showStuff()))
    const searchString = e.target.value.toUpperCase()
    if (searchString === '' && alleleSearchBeta.value === '') {
        clearSearchAlleles()
        showHideKeyword("common",true)
        document.getElementsByClassName("search-description")[0].classList.toggle("hide",false)
    }
    else {
        document.getElementsByClassName("search-description")[0].classList.toggle("hide",true)
        allelesFull.forEach(allele => {
            if (allele.element.parentElement.className === "list-of-alleles") {
                const isVisible = allele.alphaChain.includes(searchString) || allele.alphaChainShort.includes(searchString) || allele.alphaChainScientific.includes(searchString)
                allele.element.classList.toggle("hide", !isVisible)
            }
        })
    }
})

alleleSearchBeta.addEventListener("input", e => {
    //console.log(document.querySelector("[allele-selector]").addEventListener("click",showStuff()))    
    const searchString = e.target.value.toUpperCase()
    if (searchString === '' && alleleSearchAlpha.value === '') {
        clearSearchAlleles()
        showHideKeyword("common",true)
        document.getElementsByClassName("search-description")[0].classList.toggle("hide",false)
    }
    else {
        document.getElementsByClassName("search-description")[0].classList.toggle("hide",true)
        allelesFull.forEach(allele => {
            if (allele.element.parentElement.className === "list-of-alleles") {
                const isVisible = allele.betaChain.includes(searchString) || allele.betaChainShort.includes(searchString) || allele.betaChainScientific.includes(searchString)
                allele.element.classList.toggle("hide", !isVisible)
            }
        })
    }
})

function clearSearchAlleles() {
    Array.from(allelesContainer.getElementsByTagName('li')).forEach(allele => {
        allele.classList.toggle("hide",true)
    })
}

function showHideKeyword(classToChange,show) {
    allelesFull.forEach(allele => {
        if (allele.element.classList.contains(classToChange)) {
            allele.element.classList.toggle("hide",!show)
        }
    })
}

function LoadHideLogos(alleleElement) {
    const alleleBlock = document.getElementById(alleleElement)
    const label = alleleBlock.parentElement
    const sublistName = alleleElement.substring(5,8)
    if (alleleBlock.checked) {
        document.getElementById(sublistName).removeChild(label)
        addInSorted(allelesSelectedContainer.getElementsByClassName(sublistName)[0],label)
        addInSorted(document.getElementsByClassName("content")[0].getElementsByClassName(sublistName)[0],createLogoShown(alleleElement.substring(5)))

    }
    else {
        allelesSelectedContainer.getElementsByClassName(sublistName)[0].removeChild(label)
        addInSorted(document.getElementById(sublistName),label)
        const shown_graphs = document.getElementsByClassName("content")[0].getElementsByClassName(sublistName)[0]
        const graphs_to_remove = shown_graphs.getElementsByClassName(alleleElement.substring(5))[0]
        shown_graphs.removeChild(graphs_to_remove)
    }
}

function createLogoShown(allele_name) {
    const allele = allelesFull.filter(newAllele => {
        // if (newAllele.name === allele_name) {
        //     console.log(newAllele)
        // }
        return newAllele.name === allele_name
        })[0]
    var specificity = allele.specificities
    // console.log(specificity)

    const graphElement = graphsTemplate.content.cloneNode(true).children[0]
    // add title
    graphElement.querySelector('[title]').innerHTML = allele.nameScientific
    graphElement.classList.add(allele.name)

    // add download button
    const downloadPeptides = document.createElement('a')
    downloadPeptides.href = "#PATH_TO_ADD"
    downloadPeptides.className = "download-allele"
    downloadPeptides.innerText = "Download Peptides"

    graphElement.querySelector('[title]').appendChild(downloadPeptides)

    for (var spec = 1; spec <= specificity; spec++){
        
        image_name = "classIILogos/" + allele.name + '_' + spec + '.png'

        var reference = document.createElement('a')
        reference.href = image_name
        var img = document.createElement('img')
        img.src = image_name
        // if (spec <= 1){
        img.style.width='250px'
        // } else {
        //     img.style.width='125px'
        //     img.className = 'smallImg'
        // }
        reference.appendChild(img)

        graphElement.append(img)
    }
    return graphElement
}

function uncheckAll() {
    while (allelesSelectedContainer.getElementsByTagName('li').length != 0) {
        elementTohide = allelesSelectedContainer.getElementsByTagName('li')[0].getElementsByTagName('input')[0]
        elementTohide.checked = false
        LoadHideLogos(elementTohide.id)
    }
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

// function sortList(ul) {
//     var ul = document.getElementsByClassName(ul)[0]
//     Array.from(ul.getElementsByTagName("li"))
//       .sort((a, b) => a.id.localeCompare(b.id))
//       .forEach(li => ul.appendChild(li));
//   }