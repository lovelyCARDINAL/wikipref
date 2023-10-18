"use strict";
/* global mw, $, InPageEdit */

/* InPageEdit */
mw.loader.load("https://unpkg.com/mediawiki-inpageedit@latest/dist/InPageEdit.min.js");
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

//封禁用户标识
mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/markblocked.js&action=raw&ctype=text/javascript");

//用户状态
mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:AnnAngela/js/userStatus.js&action=raw&ctype=text/javascript");

//界面高亮
mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:机智的小鱼君/gadget/Highlight.js&action=raw&ctype=text/javascript");

//小工具合集
//mw.loader.load('https://mzh.moegirl.org.cn/index.php?title=User:bhsd/js/SettingsDialog.js&action=raw&ctype=text/javascript');

//Apple 彩色幕和文字模糊刮开
//mw.loader.load('https://mzh.moegirl.org.cn/index.php?title=User:星海子/Gadgets-apple-js.js&action=raw&ctype=text/javascript');

//批量回退&撤销
mw.loader.load("https://testingcf.jsdelivr.net/gh/lovelyCARDINAL/wikitool/massRollback.js");

//快速查找链入
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

/* Popups */
window.popupStructure = "menus";
window.popupHideDelay = "0.1";
window.popupActionsMenu = false;
window.popupShortcutKeys = true;
window.popupImages = false;
window.popupFixRedirs = true;
window.popupRedirAutoClick = "wpSave";
window.popupFixDabs = true;
window.popupDabsAutoClick = "wpSave";
window.popupImageLinks = false;
window.popupMinorReverts = true;
window.popupSimplifyMainLink = false;

/* UserMessages */
window.AxUserMsgCustomTemplate = [
    ["User:星海子/UserMessages/PatrollerNoEdits", "NoEdits", "维护姬编辑数不足", null, "关于近期未活跃的询问"],
    ["User:星海子/UserMessages/SysopNoEdits", "NoEdits", "管理员编辑数不足", null, "关于近期未活跃的询问"],
    ["User:星海子/UserMessages/NoVoting", "NoVoting", "管理员连续多次未参与投票", null, "关于近期未活跃的询问"],
    ["User:星海子/UserMessages/EditGroupNoEdits", "EditGroupNoEdits", "编辑组负责人活跃度不足", 32, "关于未活跃的询问"]
];

/* 屏蔽阿卡林效果 */
$(function () {
    var allElements = $("#mw-content-text > .mw-parser-output > *");
    var elements = allElements.not("#toc,.infoBox,.infotemplatebox").add(allElements.filter("h2").nextAll());
    elements.css("opacity", 1);
});

/* 修复文字模糊 */
if (/Macintosh|iPhone|iPad/.test(navigator.userAgent)) {
    mw.hook("wikipage.content").add(function ($content) {
        mw.loader.addStyleTag(".wenzimohu, .wenzimohu * { transition-duration: 0.75s; }");
        $content.find(".wenzimohu , .wenzimohu *").filter(function () {
            return $(this).css("color") == "rgba(0, 0, 0, 0)";
        })
            .hover(function () {
                $(this).css("color", ($(this).css("text-shadow").match(/rgb\(.*?\)/) || ["inherit"])[0]);
            }, function () {
                $(this).css("color", "rgba(0, 0, 0, 0)");
            });
    });
}

/* Special:Search 添加[编辑]&[历史]&[IPE] */
if (mw.config.get("wgCanonicalSpecialPageName") === "Search") {
    $(".mw-search-result-heading > a").each(function () {
        var href = $(this).attr("href");
        if (!href) return;
        this.setAttribute("target", "_blank");
        var editLink = href.replace(href, href + "?action=edit"),
            hisLink = href.replace(href, href + "?action=history");
        var $edit = $("<a>", { href: editLink, target: "_blank", text: "编辑" }),
            $his = $("<a>", { href: hisLink, target: "_blank", text: "历史" });
        $(this).after($("<span>", { class: "extra-ipe-btn" }).append("&nbsp;&nbsp;[", $edit, $his, "]"));
        mw.hook("InPageEdit").add(function (ctx) {
            ctx.InPageEdit.articleLink($edit);
        });
    });
}

/* Only for MacOS */
if (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints === 0) {

    $("#ca-addsection a").on("click", function (e) {
        e.preventDefault();
        InPageEdit.quickEdit({ section: "new" });
    });

    //显示30分钟内有编辑记录的维护组成员
    mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/OnlineAdmins.js&action=raw&ctype=text/javascript");

    //QRcode
    //mw.loader.load('https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/QRcode.js&action=raw&ctype=text/javascript');

    //版本计数器
    //mw.loader.load('https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/RevisionCounter.js&action=raw&ctype=text/javascript');

    //批量移动
    if (mw.config.get("wgNamespaceNumber") == -1 && (mw.config.get("wgTitle").toLowerCase() == "massmove" || mw.config.get("wgTitle").toLowerCase() == "mm")) {
        mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/MassMove.js&action=raw&ctype=text/javascript");
    }

    // Music163Lrc
    if (/^User:星海子\/test\/00[3-6]/.test(mw.config.get("wgPageName")) && mw.config.get("wgAction") == "edit") {
        mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:AnnAngela/js/Music163Lrc.js&action=raw&ctype=text/javascript");
    }

    //字数统计
    if (mw.config.get("wgNamespaceNumber") >= 0 && mw.config.get("wgIsArticle")) {
        mw.loader.load("https://mzh.moegirl.org.cn/index.php?title=User:星海子/js/Wordcount.js&action=raw&ctype=text/javascript");
    }

    //测试
    //mw.loader.load('https://mzh.moegirl.org.cn/index.php?title=User:星海子/test.js&action=raw&ctype=text/javascript');

    /* Category页面 添加[编辑]&[历史]&[IPE] */
    if (mw.config.get("wgNamespaceNumber") === 14
        && mw.config.get("wgIsArticle")
        && !/^(38120|99958)$/.test(mw.config.get("wgArticleId"))) {
        $(".mw-category-generated .mw-content-ltr a").each(function () {
            var href = $(this).attr("href");
            if (!href) return;
            this.setAttribute("target", "_blank");
            var editLink = href.replace(href, href + "?action=edit"),
                hisLink = href.replace(href, href + "?action=history");
            var $edit = $("<a>", { href: editLink, target: "_blank", text: "编辑" }),
                $his = $("<a>", { href: hisLink, target: "_blank", text: "历史" });
            $(this).after($("<span>", { class: "extra-ipe-btn" }).append("&nbsp;&nbsp;[", $edit, $his, "]"));
            mw.hook("InPageEdit").add(function (ctx) {
                ctx.InPageEdit.articleLink($edit);
            });
        });
    }

    /* Special:Whatlinkshere 添加[历史] */
    if (mw.config.get("wgCanonicalSpecialPageName") !== "Whatlinkshere") {
        var wlh = $(".mw-whatlinkshere-tools a:not(.in-page-edit-article-link)");
        for (var i = 0, len = wlh.length; i < len; i++) {
            if (i % 2 === 1) {
                var hishref = wlh[i].href.replace("action=edit", "action=history");
                var $his = $("<a>", { href: hishref, target: "_blank", text: "历史" });
                $his.insertAfter(wlh[i]);
                wlh[i].after(" | ");
            }
        }
    }

    /* Special:ReplaceText 添加[编辑]&[IPE] */
    if (mw.config.get("wgCanonicalSpecialPageName") === "ReplaceText") {
        $("form#choose_pages a").each(function () {
            var href = $(this).attr("href");
            if (!href) return;
            this.setAttribute("target", "_blank");
            var $edit = $("<a>", { href: href.replace(href, href + "?action=edit"), target: "_blank", text: "编辑" });
            $(this).after($("<span>", { class: "extra-ipe-btn" }).append("&nbsp;&nbsp;(", $edit, ")"));
            mw.hook("InPageEdit").add(function (ctx) {
                ctx.InPageEdit.articleLink($edit);
            });
        });
    }

    /* Special:Watchlist & Special:Recentchanges 添加[撤销]，点击changeslist-line打开新页面 */
    if (mw.config.get("wgCanonicalSpecialPageName") === "Watchlist" || mw.config.get("wgCanonicalSpecialPageName") === "Recentchanges") {
        $(".mw-changeslist-diff").each(function () {
            var href = $(this).attr("href");
            var undohref = href.replace(href, href + "&action=edit").replace("diff", "undo").replace("oldid", "undoafter");
            var $undo = $("<a>", { href: undohref, target: "_blank", text: "撤销" });
            if (this.innerText === "之前") {
                $undo.insertBefore($(this));
                $(this).before(" | ");
            }
            if (this.innerText === "差异") {
                $undo.insertAfter($(this));
                $(this).after(" | ");
            }
        });
        $(".mw-changeslist-line-inner a[href]:not(.mw-changeslist-diff,.mw-changeslist-groupdiff)").each(function () {
            this.setAttribute("target", "_blank");
        });
    }

    $(".page-Category_积压工作 #mw-content-text a[href]:not(:first)").each(function () { this.setAttribute("target", "_blank"); }); //for Category:积压工作
    $(".page-Special_日志 #mw-content-text a[href]:not(.mw-thanks-thank-link)").each(function () { this.setAttribute("target", "_blank"); }); //for Special:Log

}

/* 阻止分类重定向分类中的分类重定向 */
if (mw.config.get("wgPageName").includes("已重定向") && mw.config.get("wgNamespaceNumber") === 14 && mw.config.get("wgIsArticle")) {
    $(".CategoryTreeLabel.CategoryTreeLabelNs14.CategoryTreeLabelCategory").each(function () {
        var href = $(this).attr("href");
        var cathref = href.replace(href, href + "?redirect=no");
        $(this).attr("href", cathref);
    });
}

/* 权限变更 */
if (mw.config.get("wgArticleId") === 543137) {
    var revid = mw.config.get("wgRevisionId");
    $("h2 .mw-headline").click(function () {
        var section = $(this).attr("id");
        navigator.clipboard.writeText("[[Special:PermanentLink/" + revid + "#" + section + "]]");
    });
}

/* 注销 */
if (mw.config.get("wgArticleId") === 443483) {
    $("h2 .mw-headline").click(function () {
        navigator.clipboard.writeText($(this).attr("id").replace(/^账号注销申请_-_-{(.+?)}-(_\d+)?$/, "$1"));
    });
}

/* WikiLove */
if ($("#ca-wikilove").length > 0) {
    mw.loader.using("ext.wikiLove.local", function () {
        $.wikiLoveOptions.defaultBackgroundColor = "#fdffe7";
        $.wikiLoveOptions.defaultBorderColor = "#fceb92";
    });
}

/* 积压工作 */
$.when(mw.loader.using(["ext.gadget.backlog"]), $.ready)
    .then(function () {
        if (mw.config.get("wgArticleId") != 38120 || !mw.config.get("wgIsArticle")) { return; }
        var blocklogFlags = setInterval(function () {
            if ($(".blocklogevents-flags-nocreate")[0]) {
                clearInterval(blocklogFlags);
                $(".blocklogevents-flags-anononly").each(function () { $(this).text("anononly"); });
                $(".blocklogevents-flags-nocreate").each(function () { $(this).text("nocreate"); });
                $(".blocklogevents-flags-noemail").each(function () { $(this).text("noemail"); });
                $(".blocklogevents-flags-nousertalk").each(function () { $(this).text("nousertalk"); });
                $(".blocklogevents-flags-autoblock").each(function () { $(this).text("autoblock"); });
                $(".blocklogevents-flags-hiddenname").each(function () { $(this).text("hiddenname"); });
            }
        }, 1000);
        var abuselogClick = setInterval(function () {
            if ($("#expand-abuselogevents")[0]) {
                clearInterval(abuselogClick);
                if ($(".abuselogevents.nothing-new")[0]) { $("#expand-abuselogevents").click(); }
            }
        }, 1000);
    });

/* Special:Nuke */
if (mw.config.get("wgCanonicalSpecialPageName") === "Nuke") {
    $(".mw-checkbox-none").click(); // 默认全不选
    $(".mw-checkbox-invert").after("、<a class=\"mw-checkbox-betwen\" role=\"button\" tabindex=\"0\">连选</a>");
    $(".mw-checkbox-betwen").click(function () {
        var lastcheck = $(".mw-checkbox-toggle-controls + ul > li input[type=\"checkbox\"]:checked:last").parent()[0];
        $(".mw-checkbox-toggle-controls + ul > li input[type=\"checkbox\"]:checked:first").parent().nextUntil(lastcheck).children("input[type=\"checkbox\"]").prop("checked", true);
    });
}

/* Special:Undelete */
if (mw.config.get("wgCanonicalSpecialPageName") === "Undelete") {
    $(".mw-undelete-revlist").before("<button name=\"selectrange\" id=\"mw-undelete-selectrange\" type=\"button\" value=\"1\">连选</button>");
    $("#mw-undelete-selectrange").click(function () {
        var lastcheck = $(".mw-undelete-revlist > li input[type=\"checkbox\"]:checked:last").parent()[0];
        $(".mw-undelete-revlist > li input[type=\"checkbox\"]:checked:first").parent().nextUntil(lastcheck).children("input[type=\"checkbox\"]").prop("checked", true);
    });
}

/* Action=history 添加连选 */
(function () {
    if (mw.config.get("wgAction") !== "history") return;
    var $historylis = $("#pagehistory > li");
    if (!$historylis.length) return;
    function historyDiffRadios() {
        var nextState = "oldid", $li, $inputs, $oldidRadio, $diffRadio;
        $historylis.each(function () {
            $li = $(this);
            $inputs = $li.find("input[type=\"radio\"]");
            $oldidRadio = $inputs.filter("[name=\"oldid\"]").eq(0);
            $diffRadio = $inputs.filter("[name=\"diff\"]").eq(0);
            $li.removeClass("selected between oldid diff");
            if (!$oldidRadio.length || !$diffRadio.length) {
                return true;
            }
            if ($oldidRadio.prop("checked")) {
                $li.addClass("selected diff");
                nextState = "oldid";
            } else if ($diffRadio.prop("checked")) {
                $li.addClass("selected " + nextState);
                nextState = "between";
            } else {
                $li.addClass(nextState);
            }
        });
        return true;
    }
    $historylis.find("input[name=\"diff\"], input[name=\"oldid\"]").click(historyDiffRadios);
    historyDiffRadios();
    $(".mw-checkbox-invert").after("、<a class=\"mw-checkbox-betwen\" id=\"pagehistory-selectrange\" role=\"button\" tabindex=\"0\">连选</a>");
    $("#pagehistory-selectrange").on("click", function () {
        var checkboxes = $historylis.filter(".selected, .between").find("input[type=\"checkbox\"]"),
            notchecked = checkboxes.filter(":not(:checked)");
        if (notchecked.length > 0) {
            notchecked.prop("checked", true);
        } else {
            checkboxes.prop("checked", false);
        }
    });
})();

// Action=history 添加版本号
if (mw.config.get("wgAction") === "history") {
    $("#pagehistory li[data-mw-revid]").each(function () {
        $(this).find(".mw-changeslist-date").append(" <small>(" + $(this).data("mw-revid") + ")</small>");
    });
}

// Special:Contributions
if (mw.config.get("wgCanonicalSpecialPageName") === "Contributions") {
    var contri = location.href.replace(encodeURIComponent("用户贡献"), "Contributions");
    var sitereg = /m?zh(?=\.moegirl\.)/;
    $("#contentSub a:nth-child(6), #subtitle a:nth-child(6)").after(" | <a href=" + contri.replace(sitereg, "commons") + ">共享</a> | <a href=" + contri.replace(sitereg, "library") + ">文库</a> | <a href=" + contri.replace(sitereg, "en") + ">英文</a> | <a href=" + contri.replace(sitereg, "ja") + ">日文</a>");
}