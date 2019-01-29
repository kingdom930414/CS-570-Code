"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trieA = require("./trie");
var RLS = require("readline-sync");
var gra = require("graceful-fs");
var input = gra.readFileSync('companies.dat', "utf8");
var companies = input.split("\n");
var companies_table = {};
for (var i = 0; i < companies.length; i++) {
    var company_alias = companies[i].split("\t");
    for (var j = 0; j < company_alias.length; j++) {
        var subcompany = company_alias[j].replace(",", "").replace(".", "").trim();
        if (subcompany.indexOf(company_alias[0]) != -1 && subcompany != company_alias[0]) {
            continue;
        }
        else {
            companies_table[subcompany] = company_alias[0];
        }
    }
}
var t = new trieA.trie();
var prop;
for (prop in companies_table) {
    t.insert(prop);
}
var article = '';
var total_words = 0;
while (true) {
    var sub_article = RLS.question('Enter article (Type "." alone to stop): ');
    if (isPromptEnd(sub_article)) {
        break;
    }
    article = sub_article;
    var sub_article_arr = sub_article.split(" ");
    for (var num in sub_article_arr) {
        if (sub_article_arr[num] === 'a' || sub_article_arr[num] === 'an' || sub_article_arr[num] === 'the' || sub_article_arr[num] === 'and' || sub_article_arr[num] === 'or' || sub_article_arr[num] === 'but') {
            sub_article_arr.splice(num, 1);
        }
    }
    total_words += sub_article_arr.length;
    t.getFreqTable(article);
    console.log("Company, Hit Count, Relevance");
    var prop;
    var output = {};
    for (prop in t.statistics) {
        if (t.statistics[prop] != 0) {
            if (output[companies_table[prop]] == undefined) {
                output[companies_table[prop]] = t.statistics[prop];
            }
            else {
                output[companies_table[prop]] += t.statistics[prop];
            }
        }
    }
    var primary_company;
    var Total_Hit = 0;
    for (primary_company in output) {
        Total_Hit += output[primary_company];
        console.log(primary_company + ", " + output[primary_company] + ", " + Math.round(output[primary_company] / total_words * 10000) / 100.00 + "%");
    }
    console.log("Total, " + Total_Hit + ", " + Math.round(Total_Hit / total_words * 10000) / 100.00 + "%");
    console.log("Total words: " + total_words);
}
function isPromptEnd(sub_article) {
    for (var i in sub_article) {
        if (sub_article[i] == '.') {
            continue;
        }
        else {
            return false;
        }
    }
    return true;
}
