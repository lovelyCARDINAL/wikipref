"use strict";
/* global mw, $ */

/* InpageEdit */
mw.hook("InPageEdit").add(function (ctx) {
    const InPageEdit = ctx.InPageEdit, _msg = ctx._msg, wgPageName = mw.config.get("wgRelevantPageName"), wgRevisionId = mw.config.get("wgRevisionId");
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
mw.loader.load("https://testingcf.jsdelivr.net/gh/bhsd-harry/Wikiplus-highlight@2.55.1/main.min.js");

$.when(mw.loader.using(["mediawiki.util"]), $.ready)
    .then(function () {
        mw.util.addPortletLink("p-personal", "/分类:积压工作", "积压工作", "pt-backlog", null, null, "#pt-mycontris");
        mw.util.addPortletLink("p-navigation", "/index.php?title=Special:最新页面&hideredirs=0&namespace=all", "所有新页面", null, null, null, "#n-sidebar-newfiles");
        mw.util.addPortletLink("p-navigation", "/Special:Contributions/机娘星海酱", "Contri.bot", null, null, null, "#n-sidebar-newfiles");
        mw.util.addPortletLink("p-navigation", "/Special:Contributions/星海-adminbot", "Contri.abot", null, null, null, "#n-sidebar-newfiles");
        mw.util.addPortletLink("p-navigation", "/Special:Contributions/星海-interfacebot", "Contri.ibot", null, null, null, "#n-sidebar-newfiles");
        mw.util.addPortletLink("p-navigation", "/Special:Log/星海-adminbot", "Bot Log", null, null, null, "#n-sidebar-newfiles");
        mw.util.addPortletLink("p-navigation", "https://commons.moegirl.org.cn/index.php?curid=322098", "共享站", null, null, null, "n-sidebar-discussionboard");
        mw.util.addPortletLink("p-navigation", "/Template:萌娘百科政策文件", "政策");
        mw.util.addPortletLink("p-navigation", "/Template:论述与其他文档", "论述");
        mw.util.addPortletLink("p-navigation", "/Template:萌娘百科帮助", "帮助");
        mw.util.addPortletLink("p-navigation", "/User:星海子/Gadgets", "Gadgets");
        mw.util.addPortletLink("p-navigation", "/Special:AbuseFilter", "AbuseFilter");
        mw.util.addPortletLink("p-navigation", "/Special:Allmessages", "Allmessages");
        mw.util.addPortletLink("p-navigation", "/Special:Allpages?namespace=8", "界面消息");
        mw.util.addPortletLink("p-navigation", "/萌娘百科:界面脚本动态", "界面脚本动态");
        mw.util.addPortletLink("p-navigation", "https://github.com/lovelyCARDINAL/WikiBots/actions/workflows/manually.yaml", "即将删除", "t-sidebar-delete");
        if (mw.config.get("wgNamespaceNumber") >= 0) {
            mw.util.addPortletLink("p-tb", "/Special:ExpandTemplates", "展开模板", "p-sidebar-expandtemplates", null, null, "#t-specialpages");
            mw.util.addPortletLink("p-tb", "/Special:ChangeContentModel/" + mw.config.get("wgPageName"), "更改内容模型", "t-sidebar-changecontentmodel", null, null, "#t-specialpages");
        }
        $("#t-sidebar-delete a, #t-sidebar-expandtemplates a, #t-sidebar-changecontentmodel a").attr("target", "_blank");
        if (mw.config.get("wgNamespaceNumber") === 14 || mw.config.get("wgCanonicalSpecialPageName") === "Whatlinkshere") {
            $(mw.util.addPortletLink("p-cactions", $("#ca-masseditregex a").attr("href"), "批量正则编辑", "ca-MassEditRegex", "批量正则编辑")).attr("class", "patroller-show"); //MassEditRegex
        }
    });
