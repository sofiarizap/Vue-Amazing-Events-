const {createApp} = Vue

createApp({
    data(){ 
      return {
        apiInfo: undefined,
        maxMinPercentage: [],
        upcomingFiltered: undefined,
        pastFiltered: undefined,
      }  
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
            .then( res => res.json())
            .then(info => {
                this.apiInfo = info
                this.upcomingFiltered = this.apiInfo.events.filter(event => event.date > this.apiInfo.currentDate)
                this.pastFiltered = this.apiInfo.events.filter(event => event.date < this.apiInfo.currentDate)
                let listaPorcentaje = this.newPropertyPercentage(this.apiInfo)
                this.maxCapacity(this.apiInfo.events)
                this.morePercentage(listaPorcentaje)
                this.minPercentage(listaPorcentaje)
            })
            .catch(err => console.log(err))
    },
    methods:{
        percentageOfAttendance : function (capacity, aprox){
        let percentage = (aprox / (capacity/100)).toFixed(2)
        return percentage
    },
        newPropertyPercentage : function (data){
        let list = []
        let filteredAssistance = data.events.filter( event => event.assistance)
        
            for (let i = 0; i < filteredAssistance.length; i++) {
                    list.push(filteredAssistance[i]);
                    list[i].percentage = this.percentageOfAttendance(list[i].capacity, list[i].assistance);
            }
            return [...list.sort((a, b) => b.percentage - a.percentage)]
        },revenues : function (price, aprox){ 
            let  revenue = price * aprox
            return  revenue.toLocaleString()
        },

        morePercentage : function (events2){
            let sortedMax = [...events2.sort((a, b) => b.percentage - a.percentage)]
            this.maxMinPercentage[0] = {name: sortedMax[0].name +" : " , percentage: sortedMax[0].percentage }
        },
        
        minPercentage : function (events2){
            let sortedMin = [...events2.sort((a, b) => a.percentage - b.percentage)]
            this.maxMinPercentage[1] = {name: sortedMin[0].name+" : ", percentage: sortedMin[0].percentage}
        },
        maxCapacity : function (events){
            let maximCapacity = events.sort((a, b) => b.capacity - a.capacity)
            this.maxMinPercentage[2] = {name: maximCapacity[0].name+" : " , capacity: (maximCapacity[0].capacity).toLocaleString() + " people"} 
        }

        
    }
}).mount("#app")
/* 
function morepercentage(arrayEvents) {
    let eventName;
    let max = percentage(parseFloat(arrayEvents[0].capacity), (arrayEvents[0].assistance)).toFixed(2)
    arrayEvents.forEach(event => {
        if (percentage(event.capacity, event.assistance) > max) {
            max = percentage(event.capacity, event.assistance).toFixed(2)
            eventName = event.name
        }
    })
    return { name: eventName, percentage: max }
}

function lowestpercentage(arrayEvents) {
    let eventName;
    let min = percentage(parseFloat(arrayEvents[0].capacity), (arrayEvents[0].assistance))
    arrayEvents.forEach(event => {
        if (percentage(event.capacity, event.assistance) < min) {
            min = percentage(event.capacity, event.assistance).toFixed(2)
            eventName = event.name
        }
    })
    return { name: eventName, percentage: min }
}
// evento con la mayor capacidad
function moreCapacity(arrayEvents) {
    return arrayEvents.sort((a, b) => b.capacity - a.capacity)[0]
}
function firstTable(node, arrayEvents) {
    let tr = document.createElement('tr')
    tr.innerHTML = `<td>${morepercentage(arrayEvents).name} : ${morepercentage(arrayEvents).percentage}%</td>
                    <td>${lowestpercentage(arrayEvents).name} : ${lowestpercentage(arrayEvents).percentage}%</td>
                    <td>${moreCapacity(arrayEvents).name} : ${moreCapacity(arrayEvents).capacity} people</td>`
    node.appendChild(tr)
}
function upComingEvents(arrayEvents, date) {
    return arrayEvents.filter(item => item.date > date)
}
function pastEvents(arrayEvents, date) {
    return arrayEvents.filter(item => item.date < date)
}
function statisticsCategory(arrayEvents) {
    let arrayObjectStatisticsForCategory = []
    categories(arrayEvents).forEach(category => {
        let arrayFilteredForCategory = arrayEvents.filter(event => event.category == category)
        let revenuesForCategory = Math.round(revenues(arrayFilteredForCategory) / arrayFilteredForCategory.length)
        let percentageEvent = []
        arrayFilteredForCategory.forEach(event => {
            percentageEvent.push(Math.round(percentage(event.capacity, event.assistance || event.estimate)))
        })
        let percentageCategory = (percentageEvent.reduce((sum, percentage) => sum + percentage, 0) / percentageEvent.length).toFixed(2)
        let categoryStatistics = {
            category: category,
            revenues: revenuesForCategory,
            percentage: percentageCategory
        }
        arrayObjectStatisticsForCategory.push(categoryStatistics)
    })
    return arrayObjectStatisticsForCategory
}
function categories(arrayEvents) {
    let arrayCategories = []
    arrayEvents.forEach(event => {
        if (!arrayCategories.includes(event.category)) {
            arrayCategories.push(event.category)
        }
    })
    return arrayCategories
}
function revenues(arrayEventsCategory) {
    return arrayEventsCategory.reduce((sum, event) => sum + event.price * (parseInt(event.assistance) || parseInt(event.estimate)), 0)
}
function createTableBody(arrayObjects, node) {
    arrayObjects.forEach(element => {
        let tr = document.createElement('tr')
        tr.innerHTML = `
                        <td>${element.category}</td>
                        <td>$${element.revenues}</td>
                        <td>${element.percentage}%</td>
        `
        node.appendChild(tr)
    })
} */