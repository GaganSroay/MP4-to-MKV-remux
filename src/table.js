

class Table {
    parent
    rows=[]
    static element = tag => document.createElement(tag)

    table = Table.element("table")
    thead = Table.element('thead')
    tbody = Table.element('tbody')

    constructor(parent){
        this.parent = parent
        this.createTable()
    }

    createTable = () => {

        this.table.style.padding = "10px"
        this.table.setAttribute("id","list-table");
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
        this.parent.appendChild(this.table);
    
        let titleRow = Table.element('tr');

        let h1 = Table.element('th');
        h1.innerHTML = "Sno";
        //h1.style.paddingRight = "10px"
        //h1.style.fontSize = "12px"

        let h2 = Table.element('th');
        h2.innerHTML = "File Name";
        h2.style.textAlign = "left"
        //h2.style.paddingRight = "10px"
        //h2.style.fontSize = "12px"

        let h3 = Table.element('th');
        h3.innerHTML = "Status";
        h3.style.width = "12%"

        let h4 = Table.element('th');
        h4.innerHTML = "progress";
        h4.style.width = "12%"
    
        titleRow.appendChild(h1);
        titleRow.appendChild(h2);
        titleRow.appendChild(h3);
        titleRow.appendChild(h4);
        this.thead.appendChild(titleRow);
    }

    addRow = args => { 
        const r = new Row(args)
        this.tbody.appendChild(r.row)
        return r
    }

    setData = (data) => {
        
        //"table-row"
        let rowElement = this.table.getElementsByClassName("table-row")
        if(data.length == 0){
            this.table.getElementsByTagName("tbody")[0].remove()
            this.tbody = Table.element('tbody')
            this.table.appendChild(this.tbody)
        }
        else if(rowElement.length == 0){
            this.rows = [];
            this.table.getElementsByTagName("tbody")[0].remove()
            this.tbody = Table.element('tbody')
            this.table.appendChild(this.tbody)
            
            for (let i=0; i<data.length; i++) {
                const f = data[i];
                const r = this.addRow([i+1,f.name,"Ready",""])
                this.rows.push(r)
            }
        }
        else if(rowElement.length > data.length){
            for (let i=0; i<data.length; i++){
                const f = data[i]
                const tds = rowElement[i].getElementsByTagName("td")
                tds[0].innerHTML  = i+1;
                tds[1].getElementsByTagName("span")[0].innerHTML = f.name
                tds[2].innerHTML = "Ready"
                tds[3].remove()
                rowElement[i].appendChild(Row.prog(""))
            }

            console.log(`${data.length}     ${rowElement.length}`)
            for( let i=data.length; i<rowElement.length; i++){
                console.log(`removing ${i}`)
                rowElement[i].remove()
            }
            //this.rows = data
        }
        else{
            for (let i=0; i<rowElement.length; i++){
                const f = data[i]
                const tds = rowElement[i].getElementsByTagName("td")
                tds[0].innerHTML  = i+1;
                tds[1].getElementsByTagName("span")[0].innerHTML = f.name
                tds[2].innerHTML = "Ready"
                tds[3].remove()
                rowElement[i].appendChild(Row.prog(""))
            }
            for( let i=rowElement.length;i<data.length;i++){
                const f = data[i];
                const r = this.addRow([i+1,f.name,"Ready",""])
            }
            /*
            this.rows = [];
            this.table.getElementsByTagName("tbody")[0].remove()
            this.tbody = Table.element('tbody')
            this.table.appendChild(this.tbody)
            
            for (let i=0; i<data.length; i++) {
                const f = data[i];
                const r = this.addRow([i+1,f.name,"Ready",""])
                this.rows.push(r)
            }*/
        }

        /*
        */
    }

    updateData = (row,col,text) => {
        if(col == 3){
            this.setProgress(row,text)
        }
        else 
            this.rows[row].elements[col].innerHTML = text
    }

    deleteRow = (row)=>{
        document.getElementById("list-table").deleteRow(row);
    }

    setProgress = (row,progress) => {
        this.rows[row].progressBar.setAttribute("value",progress)
        this.rows[row].progressNumber.innerHTML = `${progress}%`
    }


}

class Row {
    elements =[]
    row
    progressBar
    progressNumber
    constructor(args){
        this.row = Table.element('tr');
        this.row.classList.add("table-row")

        let d1 = this.td(args[0])
        let d2 = this.td(args[1])
        let d3 = this.td(args[2])
        let p4 = this.tp(args[3])
        

        d1.setAttribute("id","d1");
        d2.setAttribute("id","d2");
        d3.setAttribute("id","d3");
        p4.setAttribute("id","p4");

        d1.style.width = "40px"
        
        d3.style.fontSize = "10px"
        d3.style.fontWeight = "bold"

        let img = Table.element('img')
        img.src = "./assets/trash_icon.png"
        img.style.height = "20px"
        img.classList.add("trash_icon");
        img.style.display = "none"

        d2.appendChild(img)
        d2.style.display = "flex"
        d2.style.justifyContent = "space-between"

        d2.addEventListener("mouseover", (event) => {
            img.style.display = "block"
        });

        d2.addEventListener("mouseout", (event)=>{
            img.style.display = "none"
        });
        


        this.row.appendChild(d1)
        this.row.appendChild(d2)
        this.row.appendChild(d3)
        this.row.appendChild(p4)

        this.elements.push(d1)
        this.elements.push(d2)
        this.elements.push(d3)
        this.elements.push(p4)

    }

    td = (text) => {
        let d = Table.element('td')
        let span = Table.element("span")
        span.innerHTML = text
        d.appendChild(span)
        
        return d;
    }

    tp = (text) => {
        let d = this.td("");
        d.style.padding = 0
        d.style.margin = 0
        d.style.position = "relative"

        let p = Table.element("progress")
        p.setAttribute("max", "100")
        p.setAttribute("value","0")
        p.style.position = "absolute"
        p.style.top = "0"
        p.style.left = "0"
        p.style.bottom = "0"
        p.style.right = "0"

        let t = Table.element("div")
        t.style.position = "absolute"
        t.style.top = "0"
        t.style.left = "0"
        t.style.bottom = "0"
        t.style.right = "0"
        t.style.display = "flex"
        t.style.flexDirection = "column"
        t.style.justifyContent = "center"

        let te = Table.element("div")
        t.appendChild(te)
        t.style.flex = "1"
        t.style.textAlign = "center"
        t.style.fontWeight = "bold"

        this.progressBar = p
        this.progressNumber = t

        d.appendChild(p)
        d.appendChild(t)
        return d
    }

    static tdat = (text) => {
        let d = Table.element('td')
        let span = Table.element("span")
        span.innerHTML = text
        d.appendChild(span)
        
        return d;
    }

    static prog = (text) => {
        let d = Row.tdat("");
        d.style.padding = 0
        d.style.margin = 0
        d.style.position = "relative"

        let p = Table.element("progress")
        p.setAttribute("max", "100")
        p.setAttribute("value","0")
        p.style.position = "absolute"
        p.style.top = "0"
        p.style.left = "0"
        p.style.bottom = "0"
        p.style.right = "0"

        let t = Table.element("div")
        t.style.position = "absolute"
        t.style.top = "0"
        t.style.left = "0"
        t.style.bottom = "0"
        t.style.right = "0"
        t.style.display = "flex"
        t.style.flexDirection = "column"
        t.style.justifyContent = "center"

        let te = Table.element("div")
        t.appendChild(te)
        t.style.flex = "1"
        t.style.textAlign = "center"
        t.style.fontWeight = "bold"

        //this.progressBar = p
        //this.progressNumber = t

        d.appendChild(p)
        d.appendChild(t)
        return d
    }
}

module.exports = Table

