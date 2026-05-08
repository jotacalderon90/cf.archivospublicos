const filemanager = function() {
    this.service_read = createService('GET', ':path:id');
    this.service_folder_collection = createService('GET', ':path:id/collection');
    this.service_file_collection = createService('GET', ':path:id/collection');
    this.archive = null;
    this.textFiles = ["txt", "html", "css", "js", "json", "csv", "md", "gitignore", "bowerrc"];
    this.mediaFiles = ["jpg", "gif", "png", "ico", "mp3", "mp4", "pdf"];
};

filemanager.prototype.start = async function(parent) {
    this.parent = parent;
    this.createFolder(document.getElementById("ul_directory"), "d0", {
        name: "/",
        file: "/api/filemanager/file/",
        folder: "/api/filemanager/folder/",
        path: "/"
    });
};

filemanager.prototype.close = function() {
    document.querySelectorAll("#ul_directory .selected").forEach(el => el.classList.remove("selected"));
    this.archive = null;
};

filemanager.prototype.clean = function() {
    document.querySelectorAll("#ul_directory .selected").forEach(el => el.classList.remove("selected"));
    this.archive = null;
};

filemanager.prototype.select = async function(li) {
    try {
        const label = li.querySelector("label");
        label.classList.add("selected");
        this.archive = li;

        this.isFile = label.getAttribute("data-type") === "file";
        this.isFolder = label.getAttribute("data-type") === "folder";

        this.name = label.textContent;
        this.fullname = decodeURIComponent(label.getAttribute("data-api-path"));

        if (this.isFile) {
            this.type = this.name.split(".").pop();
            this.isTextFile = this.textFiles.includes(this.type);
            this.isMediaFile = this.mediaFiles.includes(this.type);
            this.cleanURL = label.getAttribute("data-api-path");

            const apiFilePath = label.getAttribute("data-api-file");
            this.fullnameDOWNLOAD = apiFilePath + btoa(this.fullname) + "/download";
            this.fullnameGET = apiFilePath + btoa(this.fullname) + "/getfile";

            if (this.isTextFile) {
                this.parent.loader.active = true;
                let response = await this.service_read({
                    id: btoa(this.fullname),
                    path: apiFilePath
                });
                this.fileContent = response.data;
                this.parent.loader.active = false;
            } else if (this.isMediaFile) {
                let child;
                switch (this.type) {
                    case "jpg":
                    case "png":
                    case "gif":
                    case "ico":
                        child = document.createElement("img");
                        child.src = this.fullnameGET;
                        break;
                    case "mp3":
                        child = document.createElement("audio");
                        child.controls = true;
                        child.src = this.fullnameGET;
                        break;
                    case "mp4":
                        child = document.createElement("video");
                        child.controls = true;
                        child.src = this.fullnameGET;
                        break;
                    case "pdf":
                        child = document.createElement("object");
                        child.data = this.fullnameGET;
                        child.type = "application/pdf";
                        break;
                }
                document.querySelectorAll(".dv-visualcontent").forEach(el => el.innerHTML = "");
                document.querySelectorAll(".dv-visualcontent").forEach(el => el.appendChild(child));
            }
        }
    } catch (error) {
        alert(error);
        console.error(error);
    }
};

filemanager.prototype.copyCleanURL = async function() {
  await copyLarge(window.location.origin + this.cleanURL);
  alert('Url limpia copiada');
}

filemanager.prototype.createFolder = function(ulParent, id, directory) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.onchange = async (event) => {
        this.clean();
        const checkbox = event.target;
        const parentLi = checkbox.parentNode;
        const labelParent = parentLi.querySelector("label");
        if (checkbox.checked) {
            await this.select(parentLi);
            const newid = btoa(encodeURIComponent(labelParent.getAttribute("data-api-path")));
            this.parent.loader.active = true;

            let coll = await this.service_folder_collection({
                id: newid,
                path: labelParent.getAttribute("data-api-folder")
            });
            for (let i = 0; i < coll.data.length; i++) {
                this.createFolder(parentLi.lastChild, id + "d" + i, {
                    file: directory.file,
                    folder: directory.folder,
                    path: labelParent.getAttribute("data-api-path") + coll.data[i] + "/",
                    name: coll.data[i]
                });
            }

            coll = await this.service_file_collection({
                id: newid,
                path: labelParent.getAttribute("data-api-file")
            });
            for (let i = 0; i < coll.data.length; i++) {
                const fileLabel = document.createElement("label");
                fileLabel.setAttribute("data-api-file", labelParent.getAttribute("data-api-file"));
                fileLabel.setAttribute("data-api-folder", labelParent.getAttribute("data-api-folder"));
                fileLabel.setAttribute("data-api-path", labelParent.getAttribute("data-api-path") + coll.data[i]);
                fileLabel.setAttribute("data-type", "file");
                fileLabel.textContent = coll.data[i];

                const fileLi = document.createElement("li");
                fileLi.appendChild(fileLabel);
                fileLi.onclick = (e) => {
                    this.clean();
                    this.select(e.target.parentNode);
                };
                parentLi.lastChild.appendChild(fileLi);
            }
            this.parent.loader.active = false;
        } else {
            parentLi.lastChild.innerHTML = "";
        }
    };
    li.appendChild(input);

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.className = "folder";
    label.setAttribute("data-api-file", directory.file);
    label.setAttribute("data-api-folder", directory.folder);
    label.setAttribute("data-api-path", directory.path);
    label.setAttribute("data-type", "folder");
    label.textContent = directory.name;
    li.appendChild(label);

    const ul = document.createElement("ul");
    ul.className = "inside";
    li.appendChild(ul);

    ulParent.appendChild(li);
};

app.modules.filemanager = filemanager;