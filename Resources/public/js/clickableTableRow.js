var clickableTableRows = document.querySelectorAll(".oocss-clickable-table-row");

for(let i = 0; i < clickableTableRows.length; i++){
    let clickableTableRow = clickableTableRows[i];

    let link = clickableTableRow.getElementsByTagName("a")[0].getAttribute("href");

    if(link) {
        clickableTableRow.addEventListener("click", function (e) {
            window.location.href = link;
        });

    }
}