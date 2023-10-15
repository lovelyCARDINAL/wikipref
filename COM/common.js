"use strict";
/* global mw, $, InPageEdit */

/* InPageEdit */
mw.loader.load("https://testingcf.jsdelivr.net/npm/mediawiki-inpageedit");
window.InPageEdit = window.InPageEdit || {};
InPageEdit.myPreference = {
    "outSideClose": true,
    "editMinor": true,
    "noConfirmEdit": true,
    "redLinkQuickEdit": false,
    "editSummary": "    $section$oldid // Edit Via InPageEdit",
    "watchList": "nochange",
    "plugins": [
        "https://testingcf.jsdelivr.net/gh/inpageedit/Plugins@master/src/plugins/toolbox.min.js",
        "https://testingcf.jsdelivr.net/gh/inpageedit/Plugins@master/src/plugins/edit-any-page.min.js",
        "https://testingcf.jsdelivr.net/gh/inpageedit/Plugins@master/src/plugins/quick-thank.min.js",
        "https://testingcf.jsdelivr.net/gh/inpageedit/Plugins@master/src/plugins/code-mirror/script.min.js",
        "https://testingcf.jsdelivr.net/gh/inpageedit/Plugins@master/src/plugins/wiki-editor.min.js"
    ],
    "codeMirrorTheme": (
        mw.config.get("wgNamespaceNumber") % 2 === 0
        && (
            mw.config.get("wgTitle").includes(".js")
            || mw.config.get("wgTitle").includes(".css")
            || mw.config.get("wgNamespaceNumber") === 274
        )
    ) ? "solarized" : "juejin"
};
mw.hook("InPageEdit.quickEdit.codemirror").add(function (tabs) {
    var cm = tabs.cm;
    cm.setOption("indentUnit", 4);
    cm.setOption("indentWithTabs", !/^8|274$/.test(mw.config.get("wgNamespaceNumber")));
});
mw.hook("InPageEdit").add(function (ctx) {
    var InPageEdit = ctx.InPageEdit, _msg = ctx._msg, wgPageName = mw.config.get("wgRelevantPageName"), wgRevisionId = mw.config.get("wgRevisionId");
    $("#ca-edit").after(
        $("<li>", { id: "ca-quick-edit", "class": "collapsible" }).append(
            $("<span>").append($("<a>", { href: "javascript:void(0)", text: _msg("quick-edit") })
                .on("click", function () {
                    InPageEdit.quickEdit({ page: wgPageName, revision: wgRevisionId || undefined });
                })
            )
        )
    );
});


$.when(mw.loader.using("mediawiki.util"), $.ready).then(function () {
    mw.util.addPortletLink("p-personal", "/分类:积压工作", "积压工作", "pt-backlog", null, null, "#pt-mycontris");
    mw.util.addPortletLink("p-navigation", "/Special:log", "所有日志", null, null, null, "#n-newimages");
    mw.util.addPortletLink("p-navigation", "/Special:log/delete", "删除日志", null, null, null, "#n-newimages");
    mw.util.addPortletLink("p-navigation", "/Special:log/upload?subtype=overwrite", "覆盖日志", null, null, null, "#n-newimages");
    mw.util.addPortletLink("p-navigation", "/Special:Contributions/机娘星海酱", "Contri.bot", null, null, null, "#n-sidebar-newfiles");
    mw.util.addPortletLink("p-navigation", "/Special:Contributions/星海-adminbot", "Contri.abot", null, null, null, "#n-sidebar-newfiles");
    mw.util.addPortletLink("p-navigation", "/Special:Contributions/星海-interfacebot", "Contri.ibot", null, null, null, "#n-sidebar-newfiles");
    mw.util.addPortletLink("p-navigation", "/Special:Log/星海-adminbot", "Bot Log", null, null, null, "#n-sidebar-newfiles");
    mw.util.addPortletLink("p-navigation", "https://mzh.moegirl.org.cn/Special:监视列表", "回到主站", null, null, null, "#n-recentchanges");
    mw.util.addPortletLink("p-navigation", "/User:星海子/Gadgets", "Gadgets");
    mw.util.addPortletLink("p-navigation", "/Special:Allmessages", "Allmessages");
    mw.util.addPortletLink("p-navigation", "/Special:Allmessages?namespace=8", "界面消息");
    mw.util.addPortletLink("p-navigation", "https://github.com/lovelyCARDINAL/WikiBots/actions/workflows/manually.yaml", "即将删除", "p-sidebar-delete");
    mw.util.addPortletLink("p-tb", "/Special:替换文本", "替换文本", null, null, null, "#t-specialpages");
    mw.util.addPortletLink("p-tb", "/Special:log?page=" + mw.config.get("wgPageName"), "页面日志", null, null, null, "#t-info");
    mw.util.addPortletLink("p-tb", "/Special:前缀索引/" + mw.config.get("wgPageName"), "前缀索引", null, null, null, "#t-info");
    $("#p-sidebar-delete a").attr("target", "_blank");
    if (mw.config.get("wgNamespaceNumber") === 14 || mw.config.get("wgCanonicalSpecialPageName") === "Whatlinkshere") { $(mw.util.addPortletLink("p-cactions", $("#ca-masseditregex a").attr("href"), "批量正则编辑", "MassEditRegex", "批量正则编辑")).attr("class", "patroller-show"); }
});

//编辑高亮
mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:bhsd/js/wikieditor-highlight.js&action=raw&ctype=text/javascript");

//界面高亮
mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:机智的小鱼君/gadget/Highlight.js&action=raw&ctype=text/javascript");

//MassRollback
mw.loader.load("https://testingcf.jsdelivr.net/gh/lovelyCARDINAL/wikitool@main/massRollback.min.js");

//SearchLinks
window.searchLinksSite = "https://zh.moegirl.org.cn/index.php";
mw.loader.load("https://testingcf.jsdelivr.net/gh/lovelyCARDINAL/wikitool@main/searchLinks.min.js");

/* Hotcat */
window.hotcat_use_category_links = false;
mw.loader.using("mediawiki.user", function () {
    $("body").on("submit", "#hotcatCommitForm", function () {
        var submitType = this.wpDiff;
        if (submitType && (!this.oldid || this.oldid.value == "0")) {
            this.wpEditToken.value = mw.user.tokens.get("csrfToken");
            submitType.name = submitType.value = "wpSave";
        }
        return true;
    });
});

// 阻止分类重定向分类的分类重定向
if (mw.config.get("wgPageName").includes("已重定向") && mw.config.get("wgNamespaceNumber") === 14) {
    $(".CategoryTreeLabel.CategoryTreeLabelNs14.CategoryTreeLabelCategory").each(function () {
        var cathref = $(this).attr("href").replace($(this).attr("href"), $(this).attr("href") + "?redirect=no");
        $(this).attr("href", cathref);
    });
}
if (mw.config.get("wgNamespaceNumber") == -1 && (mw.config.get("wgTitle").toLowerCase() == "massmove" || mw.config.get("wgTitle").toLowerCase() == "mm")) {
    mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/MassMove.js&action=raw&ctype=text/javascript");//批量移动
}

// Special:Contributions
if (mw.config.get("wgCanonicalSpecialPageName") === "Contributions") {
    var contripage = mw.config.get("wgPageName").replace("用户贡献", "Contributions");
    $("#contentSub a:nth-child(6)").before("<a href=\"/cm:" + contripage + "\">共享</a> | <a href=\"/library:" + contripage + "\">文库</a> | <a href=\"/en:" + contripage + "\">英文</a> | <a href=\"/ja:" + contripage + "\">日文</a> | ");
}
