/**
 * \author Zachary Wartell
 * \copyright Copyright 2015. Zachary Wartell.
 * \license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */

/**
 **
 **  EXPORTED FUNCTIONS, CLASSES, ETC.
 **
 */
/*
 * @type {Readonly<{READ: symbol, TODO: symbol, OVERVIEW: symbol, GENERAL: symbol, QUESTION: symbol}>}
 */
enum Category {
    /* Instruction instance is associated with a a HTML <section> */
    SECTION = "SECTION",
    /* Instruction instance is associated with a  HTML <li> that has a child instructional <ol> tree */
    COMPOSITE = "COMPOSITE",
    /* Instruction instance is associated with a question HTML <li> */
    QUESTION = "QUESTION",
    /* Instruction instance is associated with a reading HTML <li> */
    READ = "READ",
    /* Instruction instance is associated with a todo HTML <li> */
    TODO = "TODO",
    /* Instruction instance is associated with a reminder HTML <li>. A Reminder Instructino has point fraction = 0 */
    REMINDER = "REMINDER",
    /* [considered for deprecation] Instruction instance is associated with a question HTML <li> */
    GENERAL = "GENERAL",
    OVERVIEW = "OVERVIEW",
    NON_RUBRIC = "NON_RUBRIC"
}

/*
export const CategoryToString =
    [
        "QUESTION",
        "GENERAL",
        "READ",
        "TODO",
        "OVERVIEW",
        "NON_RUBRIC",
        "REMINDER",
        "cOMPOSITE"
    ];
*/

/*
const Category = Object.freeze({
    QUESTION: Symbol("Question"),
    GENERAL: Symbol("General"),
    READ: Symbol("Read"),
    TODO: Symbol("Todo"),
    OVERVIEW: Symbol("Overview")
})
*/


function getCategoryFromClass(element, returnNull) {
    if (element.className.includes("Instruction_Question"))
        return Category.QUESTION;
    if (element.className.includes("Instruction_Read"))
        return Category.READ;
    if (element.className.includes("Instruction_Todo"))
        return Category.TODO;
    if (element.className.includes("Instruction_Overview"))
        return Category.OVERVIEW;
    if (element.className.includes("Instruction_General"))
        return Category.GENERAL;
    if (element.className.includes("Instruction_NonRubric"))
        return Category.NON_RUBRIC;
    if (element.className.includes("Instruction_Reminder"))
        return Category.REMINDER;
    if (element.className.includes("Instruction_Section"))
        return Category.SECTION;
    if (element.className.includes("Instruction_Composite"))
        return Category.COMPOSITE;

    if (returnNull)
        return null;
    else
        return Category.COMPOSITE;
}



export class OptionSet {
    name: string;
    options: Array<any>;
    constructor(n) {
        this.name = n;
        this.options = [];
    }
}

/*class Category
    {
        constructor(e)
        {
            this.value=e;
        }
        static QUESTION = 0;
        static GENERAL = 1;
        static READ = 2;
           static TODO = 3;
    };*/
export class Instruction {

    section: string;
    number: string;
    id: string;
    pointFraction: number;   // percentage of parent instruction's total points that this instruction item is worth
    points: number;
    marks: number;
    comment: string;
    short: string;
    category: Category;
    subSteps: Array<Instruction>;
    parent: Instruction;

    constructor(s: string = "", n: string = "", sh: string = "", c: Category = Category.GENERAL, pointFraction: number = 0, parent: Instruction = null) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_" + (s + "_Item_" + n).replace(/\./g, '_');
        this.pointFraction = pointFraction;
        this.points = 0;
        this.marks = 0;
        this.comment = "";
        this.parent = parent;
        this.subSteps = new Array<Instruction>();
        if (this.parent !== null)
            this.parent.subSteps.push(this);
    }
    assign(jsonObject: Object) {
        for (let p in Object)
            if (p in this)
                this[p] = jsonObject[p]
    }

    static replacer(key: any, value: any) {
        if (key === 'parent')
            return instructions.instructions.indexOf(value);
        if (key === 'subSteps') {
            const subSets: Array<number> = new Array<number>;
            for (let s of value)
                subSets.push(instructions.instructions.indexOf(s));
            return subSets;
        }
        return value;
    }
}

export class Instructions {
    instructions: Array<Instruction>;
    optionSets: Array<OptionSet>;

    totalPoints: number;
    constructor() {
        this.instructions = [];
        this.optionSets = [];
        this.totalPoints = 100;
    }

    push(i: Instruction) {
        this.instructions.push(i);
    }


    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    private collectInstructions(section: HTMLElement, sectionLabel: string, parent: Instruction) {
        let l1c = 1, l2c = 1, l3c = 1;

        /*
        **  Create Instruction for <section> 'section'
        */
        const h: HTMLElement = section.querySelector(":scope > h1, :scope > h2, :scope > h3");
        let parent0 = null;
        if (0)
            { // [wip]
            this.instructions.push(new Instruction(sectionLabel, "",
                h.innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, 'pointFraction' in section.dataset ? parseInt(section.dataset.pointFraction) : 0, parent));
            parent0 = this.instructions[instructions.instructions.length - 1];
            section.id = this.instructions[instructions.instructions.length - 1].id;
            }
        else
            parent0 = parent;

        

        const nInstructions = this.instructions.length;

        /*
        **  Collection <li> Instructions in <section> 'section'
        */
        const temp: string = "self" + Date.now().toString();
        section.id = temp;
        let olList = section.querySelectorAll(":scope > ol.Instruction, :scope > ul.Instruction");
        //section.id = "";
        if (olList !== null && olList.length !== 0) {
            /*
            **  Collection level 1 <li> Instructions
            */
            for (let ol of olList) {
                let li1List = ol.querySelectorAll(":scope > li");
                let category = getCategoryFromClass(<HTMLElement>ol, false);

                l1c = 1;
                const equalFraction1: number = 1.0 / li1List.length * 100;
                /*
                **  Collection level 2 <li> Instructions
                */
                for (let li1_ of li1List) {
                    let li1: HTMLElement = <HTMLElement>li1_;
                    let tmp, cat = (tmp = getCategoryFromClass(li1, true)) !== null ? tmp : category;

                    if (tmp === Category.NON_RUBRIC)
                        continue;
                    this.instructions.push(new Instruction(sectionLabel, itemString(l1c),
                        li1.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li1.dataset ? parseInt(li1.dataset.pointFraction) : equalFraction1, parent0));
                    const parent1 = this.instructions[instructions.instructions.length - 1];
                    li1.id = this.instructions[this.instructions.length - 1].id;

                    let ol1: HTMLElement = li1.querySelector(":scope > ol");
                    /*
                    **  Collection level 3 <li> Instructions
                    */
                    if (ol1 !== null) { //&& ol1.length !== 0) {
                        let category1 = getCategoryFromClass(ol1, false);

                        let li2List = ol1.querySelectorAll(":scope > li"); // only children, no nested descendants
                        l2c = 1;
                        const equalFraction2: number = 1.0 / li2List.length * 100;
                        for (let li2_ of li2List) {
                            const li2: HTMLElement = <HTMLElement>li2_;
                            let tmp, cat = (tmp = getCategoryFromClass(li2, true)) !== null ? tmp : category1;

                            this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c),
                                li2.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li2.dataset ? parseInt(li2.dataset.pointFraction) : equalFraction2, parent1));
                            const parent2 = this.instructions[instructions.instructions.length - 1];
                            li2.id = this.instructions[this.instructions.length - 1].id;
                            let ol2: HTMLOListElement = <HTMLOListElement>li2.querySelector(":scope > ol");
                            if (ol2 !== null) {// && ol2.length !== 0) {
                                /*
                                **  Collection level 3 <li> Instructions
                                */
                                let category2 = getCategoryFromClass(ol2, false);

                                let li3List = ol2.querySelectorAll(":scope > li"); // only children, no nested descendants
                                l3c = 1;
                                const equalFraction3: number = 1.0 / li3List.length * 100;
                                for (let li3_ of li3List) {
                                    const li3: HTMLOListElement = <HTMLOListElement>li3_;
                                    let tmp, cat = (tmp = getCategoryFromClass(li3, true)) !== null ? tmp : category2;

                                    this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c, l3c),
                                        li3.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li3.dataset ? parseInt(li3.dataset.pointFraction) : equalFraction3, parent2));
                                    li3.id = this.instructions[this.instructions.length - 1].id;
                                    l3c++;
                                }
                            }
                            l2c++;
                        }
                    }
                    l1c++;
                }
            }
        }


        // remove section if it contains no <ol class=Instruction>
        //if (nInstructions === instructions.instructions.length)
            //instructions.instructions.pop();
    }

    /**
     *
     - Lost track of history of this relative to Rubric.js.  I suspect Rubric.js is 'old' since it is not .ts code.
     **/
    extractRubric() {

        let h1c, h2c, h3c;   // 'headingCountX' ....

        /**
         * \todo [priority=low] these nested for loops argument for refactoring into a single for loop with recursiion, albiet with perhaps(?) slightly different
         * rules applied depending on the depth the recursion
         */

        /**
         *   <section> <h1>
         */
        let h1List = document.querySelectorAll("section > h1");
        h1c = 1;
        let parent1 = null;
        let lastH1NoInstructions: boolean = true;
        for (let h1 of h1List) {
            const section1: HTMLElement = h1.parentElement;
            console.log("h1: ", (<HTMLElement>h1).innerText);
            console.assert(section1.tagName === "SECTION");

            if (section1.classList.contains("Instruction_Section"))
            {   
                parent1 = new Instruction(h1c.toString(), "",(<HTMLHeadingElement>h1).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION,'pointFraction' in section1.dataset ? parseInt(section1.dataset.pointFraction) : 0)             
                this.instructions.push (parent1);                
            }


            const h1InstructionCount = this.instructions.length;
            this.collectInstructions(section1, h1c.toString(), parent1);

            const h1NoInstructions: boolean = h1InstructionCount === this.instructions.length;
            //if (lastH1NoInstructions)
            lastH1NoInstructions = h1NoInstructions;


            /**
             *   <section> <h2>
            */
            //let h2List = parent.querySelectorAll(":nth-child(" + selfIndex + ") > section > h2"); // all <h2> children in this <h1> element 'h1'    
            let h2List = section1.querySelectorAll(":scope > section > h2"); // all <h2> children in this <h1> element 'h1'    
            let parent2 = null;
            if (h2List !== null && h2List.length !== 0) {
                h2c = 1;
                for (let h2 of h2List) {
                    const section2 = h2.parentElement;
                    console.log("h2: ", (<HTMLElement>h2).innerText);
                    console.assert(section2.tagName === "SECTION");

                    if (section2.classList.contains("Instruction_Section"))
                    {                
                        parent2 = new Instruction(h1c.toString() + "." + h2c.toString(), "",(<HTMLHeadingElement>h2).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION,'pointFraction' in section2.dataset ? parseInt(section2.dataset.pointFraction) : 0,parent1);
                        this.instructions.push (parent2);
                    }
        
                    const h2InstructionCount = this.instructions.length;
                    this.collectInstructions(section2, h1c.toString() + "." + h2c.toString(), parent2);
                    const h2NoInstructions: boolean = h2InstructionCount === this.instructions.length;

                    /** 
                    *   <section> <h3>
                    */
                    let h3List = section2.querySelectorAll(":scope > section > h3");
                    if (h3List !== null && h3List.length !== 0) {
                        h3c = 1;
                        for (let h3 of h3List) {
                            const section3 = h3.parentElement;
                            console.assert(section3.tagName === "SECTION");

                            if (section3.classList.contains("Instruction_Section"))
                            {                
                                this.instructions.push (new Instruction(h1c.toString() + "." + h2c.toString() + "." + h3c.toString(), "",(<HTMLHeadingElement>h3).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION,'pointFraction' in section3.dataset ? parseInt(section3.dataset.pointFraction) : 0,parent2));                                
                            }

                            const h3InstructionCount = this.instructions.length;
                            this.collectInstructions(section3, h1c.toString() + "." + h2c.toString() + "." + h3c.toString(), parent2);
                            const h3NoInstructions: boolean = h3InstructionCount === this.instructions.length;

                            if (0)
                                // if this <Section> had no Instructions, create Instruction  Category.SECTION
                                if (h3NoInstructions && instructions.instructions.length != h3InstructionCount) {
                                    instructions.push(instructions.instructions[instructions.instructions.length - 1]);
                                    instructions.instructions.copyWithin(h3InstructionCount, h3InstructionCount - 1, instructions.instructions.length - 2);

                                    const section = h3.parentElement;
                                    instructions.instructions[h3InstructionCount] = new Instruction(h1c.toString() + "." + h2c.toString() + "." + h3c.toString(), "",
                                        (<HTMLHeadingElement>h3).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, 'pointFraction' in section.dataset ? parseInt(section.dataset.pointFraction) : 0, parent2);
                                    section.id = instructions.instructions[h3InstructionCount].id;
                                }
                            h3c++;
                        }

                    }

                    if (0)
                        if (h2NoInstructions && instructions.instructions.length != h2InstructionCount) {
                            instructions.push(instructions.instructions[instructions.instructions.length - 1]);
                            instructions.instructions.copyWithin(h2InstructionCount, h2InstructionCount - 1, instructions.instructions.length - 2);

                            const section = h2.parentElement;
                            instructions.instructions[h2InstructionCount] = new Instruction(h1c.toString() + "." + h2c.toString(), "",
                                (<HTMLHeadingElement>h2).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, 'pointFraction' in section.dataset ? parseInt(section.dataset.pointFraction) : 0);
                            section.id = instructions.instructions[h2InstructionCount].id;
                        }
                    h2c++;
                }

                if (0)
                    if (h1NoInstructions && instructions.instructions.length != h1InstructionCount) {
                        instructions.push(instructions.instructions[instructions.instructions.length - 1]);
                        instructions.instructions.copyWithin(h1InstructionCount, h1InstructionCount - 1, instructions.instructions.length - 2);

                        const section = h1.parentElement;
                        instructions.instructions[h1InstructionCount] = new Instruction(h1c.toString(), "",
                            (<HTMLHeadingElement>h1).innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, 'pointFraction' in section.dataset ? parseInt(section.dataset.pointFraction) : 0);
                        section.id = instructions.instructions[h1InstructionCount].id;
                    }
            }
            if (h1.className !== "nocount")
                h1c++;
        }

        /**
         *  compute points from fraction hierarchy
         */
        for (let instruction of this.instructions) {
            instruction.points = this.totalPoints;
            for (let p = instruction; p != null; p = p.parent)
                instruction.points *= p.pointFraction / 100;
        }
        console.log(instructions);
        console.log(this.instructions);
        this.displayRubric();
    }
    //console.log("instructions.length:"+instructions.length);

    displayRubric() {
        /*
         * construct <tbody> for <table> (#RubricTable) using instructions array and add
         * various <input> HTML elements to certain <table> columns
         */
        let rubric: HTMLTableSectionElement = document.querySelector("#RubricTable > tbody");
        let prevSection: string = "";
        const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
        let ri = 0;
        for (let instruction of this.instructions) {
            let row = document.createElement("tr");
            row.setAttribute("data-ri", ri.toString());
            if (instruction.section === prevSection)
                row.innerHTML =
                    `<td class="Empty"></td>
                 <td>${instruction.number}</td>
				 <td>${Category[instruction.category].toLowerCase()}</td>
				 <td><a href="#${instruction.id}">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td>${instruction.pointFraction.toFixed(0)}</td>
                 <td>${instruction.points.toFixed(2)}</td>
                 <td></td>
                 <td><input type="text"></td>`;
            else
                row.innerHTML =
                    `<td>${instruction.section}</td>
				 <td>${instruction.number}</td>
				 <td>${Category[instruction.category].toLowerCase()}</td>
				 <td><a href="#${instruction.id}">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td>${instruction.pointFraction.toFixed(0)}</td>
                 <td>${instruction.points.toFixed(2)}</td>
                 <td></td>
                 <td><input type="text"></td>`;
            prevSection = instruction.section;
            row.querySelector('input[type="text"]').addEventListener('input',
                (e: Event) => {
                    const itemID = (<HTMLInputElement>(e.target)).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                    const rowIndex = parseInt((<HTMLInputElement>(e.target)).parentElement.parentElement.getAttribute("data-ri"));
                    console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                    console.log(instructions.instructions[rowIndex]);
                    instructions.instructions[rowIndex].comment = (<HTMLInputElement>(e.target)).value;
                });
            rubric.append(row);
            ri++;
        }
        let ttd = document.getElementById("Total");
        //(<HTMLElement>ttd.nextElementSibling).innerText = total.toString();

    }
}
export const instructions = new Instructions();

/**
 **
 **  INTERNAL FUNCTIONS
 **
 */

function itemString(...args: number[]) {
    const aCode = "a".charCodeAt(0);
    switch (arguments.length) {
        case 1:
            return args[0].toString();
        case 2:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1);
        case 3:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1) + "." + roman_lower(args[2]);
    }
}

const ROMAN_VALUE = Uint16Array.from(
    [
        1000,
        900,
        500,
        400,
        100,
        90,
        50,
        40,
        10,
        9,
        5,
        4,
        1
    ]);

const ROMAN_SYMBOL =
    [
        "m",
        "cm",
        "d",
        "cd",
        "c",
        "xc",
        "l",
        "xl",
        "x",
        "ix",
        "v",
        "iv",
        "i"
    ];

function roman_lower(n): string {
    let str = "";
    for (let i = 0; i < 13; i++) {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        str += ROMAN_SYMBOL[i].repeat(q);
    }
    return str;
}
