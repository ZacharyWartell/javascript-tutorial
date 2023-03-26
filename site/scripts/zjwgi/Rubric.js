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
var Category;
(function (Category) {
    Category["QUESTION"] = "QUESTION";
    Category["GENERAL"] = "GENERAL";
    Category["READ"] = "READ";
    Category["TODO"] = "TODO";
    Category["OVERVIEW"] = "OVERVIEW";
    Category["NON_RUBRIC"] = "NON_RUBRIC";
    Category["REMINDER"] = "REMINDER";
    Category["SECTION"] = "SECTION";
})(Category || (Category = {}));
export const CategoryToString = [
    "QUESTION",
    "GENERAL",
    "READ",
    "TODO",
    "OVERVIEW",
    "NON_RUBRIC",
    "REMINDER"
];
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
    if (returnNull)
        return null;
    else
        return Category.GENERAL;
}
export class OptionSet {
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
    constructor(s = "", n = "", sh = "", c = Category.GENERAL, points = 0, parent = null) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_" + (s + "_Item_" + n).replace(/\./g, '_');
        this.pointFraction = 0;
        this.points = points;
        this.marks = 0;
        this.comment = "";
        this.parent = parent;
        this.subSteps = new Array();
        if (this.parent !== null)
            this.parent.subSteps.push(this);
    }
    assign(jsonObject) {
        for (let p in Object)
            if (p in this)
                this[p] = jsonObject[p];
    }
    static replacer(key, value) {
        if (key === 'parent')
            return instructions.instructions.indexOf(value);
        if (key === 'subSteps') {
            const subSets = new Array;
            for (let s of value)
                subSets.push(instructions.instructions.indexOf(s));
            return subSets;
        }
        return value;
    }
}
export class Instructions {
    constructor() {
        this.instructions = [];
        this.optionSets = [];
    }
    push(i) {
        this.instructions.push(i);
    }
    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    collectInstructions(section, sectionLabel, parent) {
        let l1c = 1, l2c = 1, l3c = 1;
        /*
        **  Create Instruction for <section> 'section'
        */
        const h = section.querySelector(":scope > h1, :scope > h2, :scope > h3");
        instructions.push(new Instruction(sectionLabel, "", h.innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, section.dataset.pointFraction !== undefined ? parseInt(section.dataset.pointFraction) : 0, parent));
        const parent0 = instructions.instructions[instructions.instructions.length - 1];
        section.id = instructions.instructions[instructions.instructions.length - 1].id;
        const nInstructions = instructions.instructions.length;
        /*
        **  Collection <li> Instructions in <section> 'section'
        */
        const temp = "self" + Date.now().toString();
        section.id = temp;
        let olList = section.querySelectorAll(":scope > ol.Instruction, :scope > ul.Instruction");
        //section.id = "";
        if (olList !== null && olList.length !== 0) {
            /*
            **  Collection level 1 <li> Instructions
            */
            for (let ol of olList) {
                let li1List = ol.querySelectorAll(":scope > li");
                let category = getCategoryFromClass(ol, false);
                l1c = 1;
                const equalFraction1 = 1.0 / li1List.length * 100;
                /*
                **  Collection level 2 <li> Instructions
                */
                for (let li1_ of li1List) {
                    let li1 = li1_;
                    let tmp, cat = (tmp = getCategoryFromClass(li1, true)) !== null ? tmp : category;
                    if (tmp === Category.NON_RUBRIC)
                        continue;
                    instructions.push(new Instruction(sectionLabel, itemString(l1c), li1.innerText.trimStart().slice(0, 10) + " ...", cat, li1.dataset.pointFraction !== undefined ? parseInt(li1.dataset.pointFraction) : equalFraction1, parent0));
                    const parent1 = instructions.instructions[instructions.instructions.length - 1];
                    li1.id = instructions.instructions[instructions.instructions.length - 1].id;
                    let ol1 = li1.querySelector(":scope > ol");
                    /*
                    **  Collection level 3 <li> Instructions
                    */
                    if (ol1 !== null) { //&& ol1.length !== 0) {
                        let category1 = getCategoryFromClass(ol1, false);
                        let li2List = ol1.querySelectorAll(":scope > li"); // only children, no nested descendants
                        l2c = 1;
                        const equalFraction2 = 1.0 / li2List.length * 100;
                        for (let li2_ of li2List) {
                            const li2 = li2_;
                            let tmp, cat = (tmp = getCategoryFromClass(li2, true)) !== null ? tmp : category1;
                            instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c), li2.innerText.trimStart().slice(0, 10) + " ...", cat, li2.dataset.pointFraction !== undefined ? parseInt(li2.dataset.pointFraction) : equalFraction2, parent1));
                            const parent2 = instructions.instructions[instructions.instructions.length - 1];
                            li2.id = instructions.instructions[instructions.instructions.length - 1].id;
                            let ol2 = li2.querySelector(":scope > ol");
                            if (ol2 !== null) { // && ol2.length !== 0) {
                                /*
                                **  Collection level 3 <li> Instructions
                                */
                                let category2 = getCategoryFromClass(ol2, false);
                                let li3List = ol2.querySelectorAll(":scope > li"); // only children, no nested descendants
                                l3c = 1;
                                const equalFraction3 = 1.0 / li3List.length * 100;
                                for (let li3_ of li3List) {
                                    const li3 = li3_;
                                    let tmp, cat = (tmp = getCategoryFromClass(li3, true)) !== null ? tmp : category2;
                                    instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c, l3c), li3.innerText.trimStart().slice(0, 10) + " ...", cat, li3.dataset.pointFraction !== undefined ? parseInt(li3.dataset.pointFraction) : equalFraction3, parent2));
                                    li3.id = instructions.instructions[instructions.instructions.length - 1].id;
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
        if (nInstructions === instructions.instructions.length)
            instructions.instructions.pop();
    }
    /**
     *
     - Lost track of history of this relative to Rubric.js.  I suspect Rubric.js is 'old' since it is not .ts code.
     **/
    extractRubric() {
        let h1c, h2c, h3c; // 'headingCountX' ....
        /**
         *   <section> <h1>
         */
        let h1List = document.querySelectorAll("section > h1");
        h1c = 1;
        for (let h1 of h1List) {
            console.assert(h1.parentElement.tagName === "SECTION");
            const h1InstructionCount = instructions.instructions.length;
            this.collectInstructions(h1.parentElement, h1c.toString(), null);
            const h1NoInstructions = h1InstructionCount === instructions.instructions.length;
            let parent = h1.parentElement;
            let parent1 = null;
            if (h1NoInstructions)
                parent1 = instructions.instructions[h1InstructionCount];
            let selfIndex = [].slice.call(parent.children).indexOf(h1) + 1; // index of <h1> element, 'h1', within it's parent HTML element
            /**
             *   <section> <h2>
            */
            let h2List = parent.querySelectorAll(":nth-child(" + selfIndex + ") ~ section > h2"); // all <h2> children in this <h1> element 'h1'    
            if (h2List !== null && h2List.length !== 0) {
                h2c = 1;
                for (let h2 of h2List) {
                    console.assert(h2.parentElement.tagName === "SECTION");
                    const h2InstructionCount = instructions.instructions.length;
                    this.collectInstructions(h2.parentElement, h1c.toString() + "." + h2c.toString(), parent1);
                    const h2NoInstructions = h2InstructionCount === instructions.instructions.length;
                    let parent = h2.parentElement;
                    let parent2 = null;
                    if (h2NoInstructions)
                        parent2 = instructions.instructions[h2InstructionCount];
                    let selfIndex = [].slice.call(parent.children).indexOf(h2) + 1;
                    /**
                    *   <section> <h3>
                    */
                    let h3List = parent.querySelectorAll(":nth-child(" + selfIndex + ") ~ section > h3");
                    if (h3List !== null && h3List.length !== 0) {
                        h3c = 1;
                        for (let h3 of h3List) {
                            console.assert(h3.parentElement.tagName === "SECTION");
                            const h3InstructionCount = instructions.instructions.length;
                            this.collectInstructions(h3.parentElement, h1c.toString() + "." + h2c.toString() + "." + h3c.toString(), parent2);
                            const h3NoInstructions = h3InstructionCount === instructions.instructions.length;
                            if (0)
                                // if this <Section> had no Instructions, create Instruction  Category.SECTION
                                if (h3NoInstructions && instructions.instructions.length != h3InstructionCount) {
                                    instructions.push(instructions.instructions[instructions.instructions.length - 1]);
                                    instructions.instructions.copyWithin(h3InstructionCount, h3InstructionCount - 1, instructions.instructions.length - 2);
                                    const section = h3.parentElement;
                                    instructions.instructions[h3InstructionCount] = new Instruction(h1c.toString() + "." + h2c.toString() + "." + h3c.toString(), "", h3.innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, section.dataset.pointFraction !== undefined ? parseInt(section.dataset.pointFraction) : 0, parent2);
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
                            instructions.instructions[h2InstructionCount] = new Instruction(h1c.toString() + "." + h2c.toString(), "", h2.innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, section.dataset.pointFraction !== undefined ? parseInt(section.dataset.pointFraction) : 0);
                            section.id = instructions.instructions[h2InstructionCount].id;
                        }
                    h2c++;
                }
                if (h1NoInstructions && instructions.instructions.length != h1InstructionCount) {
                    instructions.push(instructions.instructions[instructions.instructions.length - 1]);
                    instructions.instructions.copyWithin(h1InstructionCount, h1InstructionCount - 1, instructions.instructions.length - 2);
                    const section = h1.parentElement;
                    instructions.instructions[h1InstructionCount] = new Instruction(h1c.toString(), "", h1.innerText.trimStart().slice(0, 10) + " ...", Category.SECTION, section.dataset.pointFraction !== undefined ? parseInt(section.dataset.pointFraction) : 0);
                    section.id = instructions.instructions[h1InstructionCount].id;
                }
            }
            if (h1.className !== "nocount")
                h1c++;
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
        let rubric = document.querySelector("#RubricTable > tbody");
        let prevSection = "";
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
                 <td></td>
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
                 <td></td>
                 <td></td>
                 <td><input type="text"></td>`;
            prevSection = instruction.section;
            row.querySelector('input[type="text"]').addEventListener('input', (e) => {
                const itemID = (e.target).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                const rowIndex = parseInt((e.target).parentElement.parentElement.getAttribute("data-ri"));
                console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                console.log(instructions.instructions[rowIndex]);
                instructions.instructions[rowIndex].comment = (e.target).value;
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
function itemString(...args) {
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
const ROMAN_VALUE = Uint16Array.from([
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
const ROMAN_SYMBOL = [
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
function roman_lower(n) {
    let str = "";
    for (let i = 0; i < 13; i++) {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        str += ROMAN_SYMBOL[i].repeat(q);
    }
    return str;
}
//# sourceMappingURL=Rubric.js.map