const listButtonStatus = document.querySelectorAll("[button-status]");
if(listButtonStatus.length > 0){
    let url = new URL(window.location.href);
    listButtonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status){
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            console.log(url);
            window.location.href = url.href;
        })
    });
    const statusCurrent = url.searchParams.get("status") || "";
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    console.log(buttonCurrent);
    buttonCurrent.classList.add("active");
}
// Form Search 
const formSearch = document.querySelector("[form-search]");
if (formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        // console.log("Chay vao day");
        // console.log(event.target.elements.keyword.value);
        const keyword = event.target.elements.keyword.value;
        if (keyword){
            url.searchParams.set("keyword", keyword);
        } else {
            utl.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
// End Form Search
// Pagination 
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0){
    let url = new URL(window.location.href);
    listButtonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
// Button change status 
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length > 0){
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const link = button.getAttribute("link");
            fetch(link, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application.json",
                },
            })
            .then(res => res.json())
            .then(data => {
                if (data.code == 200){
                    window.location.reload();
                }
            })
        })
    })
}
// CheckItem
const inputCheckAll = document.querySelector("input[name='checkAll']");
// console.log(checkAll);
if (inputCheckAll){
    const listInputCheckItem = document.querySelectorAll("input[name='checkItem']")
    inputCheckAll.addEventListener("click", () => {
        console.log(inputCheckAll.checked);
        listInputCheckItem.forEach(inputCheckItem => {
            inputCheckItem.checked = inputCheckAll.checked;
        })
    });

    listInputCheckItem.forEach(inputCheckItem => {
        inputCheckItem.addEventListener("click", () => {
            const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItem']:checked");
            console.log(listInputCheckItemChecked.length);
            if (listInputCheckItem.length == listInputCheckItemChecked.length){
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}


// End CheckItem
// Box-action 
const boxActions = document.querySelector("[box-actions]");
console.log(boxActions);
if (boxActions){
    const button = boxActions.querySelector("button");
    button.addEventListener("click", () => {
        const select = boxActions.querySelector("select");
        const status = select.value;
        const listInputChecked = document.querySelectorAll("input[name='checkItem']:checked");
        const ids = [];
        listInputChecked.forEach(input => {
            ids.push(input.value);
        });

        if (status != "" && ids.length > 0){
            console.log(status);
            console.log(ids);
            const dataChangeMulti = {
                status: status,
                ids: ids
            };
            // console.log(data);
            const link = boxActions.getAttribute("box-actions");
            fetch(link, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",

                },
                body: JSON.stringify(dataChangeMulti)
            })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    window.location.reload();
                }
            })
        } else {
            alert("Hanh dong va items phai duoc chon");
        }
    })
}
// Xoa ban ghi:
const listButtonDelete = document.querySelectorAll("[button-delete]");
// if (listButtonDelete.length == 0) {
//     console.log("OKE");
// }
if (listButtonDelete.length > 0){
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const link = button.getAttribute("button-delete");
            fetch(link , {
                method: "PATCH",

            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200)
                    window.location.reload();
                });
            })
        });
}
// Khoi phuc ban ghi:
    const listButtonRestore = document.querySelectorAll("[button-restore]");
    if (listButtonRestore.length == 0) {
        console.log("OKE");
    }
    if (listButtonRestore.length > 0){
        listButtonRestore.forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("button-restore");
                console.log(id);
                fetch(`/admin222/trash/restore/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200) {
                        window.location.reload();
                    }
                })
                .catch(error => console.error("Error:", error));
            })
        })
    }
// Thay doi vi tri


const listInputPosition = document.querySelectorAll("input[name='position']");
if (listInputPosition.length > 0){
    listInputPosition.forEach(input => {
        input.addEventListener("change", () => {
            const link = input.getAttribute("link");
            const position = parseInt(input.value);
            console.log(link);
            console.log(position);
            fetch(link, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    position: position
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
        });
    });
} else {
    console.log("OKE");
}
// Het thay doi vi tri
// Show-Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert){
    let time = showAlert.getAttribute("show-alert") || 3000;
    time = parseInt(time);
    console.log(time);
    setTimeout(() => {
        showAlert.classList.add("hidden");
    }, time);
} else {
    console.log("OKE");
}

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", () => {
        console.log(uploadImageInput.files); // Tra ra 1 danh sach cac file anh
        const file = uploadImageInput.files[0];
        if (file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// SORT
const sort = document.querySelector("[sort]");
if (sort){
    let url = new URL(window.location.href);
    const select = sort.querySelector("[sort-select]");
    select.addEventListener("change", () => {
        const [sortKey, sortValue] = select.value.split("-");
        // console.log(sortKey);
        if (sortKey && sortValue){
            console.log("Abc");
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            window.location.href = url.href;
        }
    })

    // Them selected mac dinh cho the option:
    const defaultSortKey = url.searchParams.get("sortKey");
    const defaultSortValue = url.searchParams.get("sortValue");
    if (defaultSortKey && defaultSortValue){
        // console.log(defaultSortKey);
        // console.log(defaultSortValue);
            const optionSelected = select.querySelector(`option[value="${defaultSortKey}-${defaultSortValue}"]`);
            optionSelected.setAttribute("selected", true);
            // optionSelected.selected = true
    }
    // Clear 
    const buttonClear = document.querySelector("[sort-clear]");
    if (buttonClear){
        buttonClear.addEventListener("click", () => {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
            window.location.href = url.href;
        })
    }
}
// End srot
