! function(e) {
	("object" != typeof exports || "undefined" == typeof module) && "function" ==
	typeof define && define.amd ? define(e) : e()
}(function() {
	"use strict";

	function e(e, n) {
		var t, a = (n = void 0 === n ? {} : n)
			.insertAt;
		e && "undefined" != typeof document && (t = document.head ||
			document.getElementsByTagName("head")[0], (n = document.createElement(
				"style"))
			.type = "text/css", "top" === a && t.firstChild ? t.insertBefore(
				n, t.firstChild) : t.appendChild(n), n.styleSheet ? n.styleSheet
			.cssText = e : n.appendChild(document.createTextNode(e)))
	}
	var t;

	function a(e) {
		e && null != t && (e = e.getBoundingClientRect()
			.top, document.querySelector(".sidebar")
			.scrollBy(0, e - t))
	}

	function n() {
		requestAnimationFrame(function() {
			var e = document.querySelector(
				".app-sub-sidebar > .active");
			if (e)
				for (e.parentNode.parentNode.querySelectorAll(
						".app-sub-sidebar")
					.forEach(function(e) {
						return e.classList.remove("open")
					}); e.parentNode.classList.contains(
						"app-sub-sidebar") && !e.parentNode.classList
					.contains("open");) e.parentNode.classList.add(
					"open"), e = e.parentNode
		})
	}

	function o(e) {
		t = e.target.getBoundingClientRect()
			.top;
		var n = d(e.target, "LI", 2);
		n && (n.classList.contains("open") ? (n.classList.remove("open"),
			setTimeout(function() {
				n.classList.add("collapse")
			}, 0)) : (function(e) {
			if (e)
				for (e.classList.remove("open", "active"); e &&
					"sidebar-nav" !== e.className && e.parentNode;
				) "LI" !== e.parentNode.tagName &&
					"app-sub-sidebar" !== e.parentNode.className ||
					e.parentNode.classList.remove("open"), e =
					e.parentNode
		}(s()), i(n), setTimeout(function() {
			n.classList.remove("collapse")
		}, 0)), a(n))
	}

	function s() {
		var e = document.querySelector(".sidebar-nav .active");
		return e || (e = d(document.querySelector('.sidebar-nav a[href="'.concat(
			decodeURIComponent(location.hash)
			.replace(/ /gi, "%20"), '"]')), "LI", 2)) && e.classList.add(
			"active"), e
	}

	function i(e) {
		if (e)
			for (e.classList.add("open", "active"); e && "sidebar-nav" !==
				e.className && e.parentNode;) "LI" !== e.parentNode.tagName &&
				"app-sub-sidebar" !== e.parentNode.className || e.parentNode
				.classList.add("open"), e = e.parentNode
	}

	function d(e, n, t) {
		if (e && e.tagName === n) return e;
		for (var a = 0; e;) {
			if (t < ++a) return;
			if (e.parentNode.tagName === n) return e.parentNode;
			e = e.parentNode
		}
	}
	e(
		".sidebar-nav > ul > li ul {\n  display: none;\n}\n\n.app-sub-sidebar {\n  display: none;\n}\n\n.app-sub-sidebar.open {\n  display: block;\n}\n\n.sidebar-nav .open > ul:not(.app-sub-sidebar),\n.sidebar-nav .active:not(.collapse) > ul {\n  display: block;\n}\n\n/* 抖动 */\n.sidebar-nav li.open:not(.collapse) > ul {\n  display: block;\n}\n\n.active + ul.app-sub-sidebar {\n  display: block;\n}\n"
	), document.addEventListener("scroll", n);
	e(
		"@media screen and (max-width: 768px) {\n  /* 移动端适配 */\n  .markdown-section {\n    max-width: none;\n    padding: 16px;\n  }\n  /* 改变原来按钮热区大小 */\n  .sidebar-toggle {\n    padding: 0 0 10px 10px;\n  }\n  /* my pin */\n  .sidebar-pin {\n    appearance: none;\n    outline: none;\n    position: fixed;\n    bottom: 0;\n    border: none;\n    width: 40px;\n    height: 40px;\n    background: transparent;\n  }\n}\n"
	);
	var r, c = "DOCSIFY_SIDEBAR_PIN_FLAG";

	function l() {
		var e = "true" === (e = localStorage.getItem(c));
		localStorage.setItem(c, !e), e ? (document.querySelector(".sidebar")
			.style.transform = "translateX(0)", document.querySelector(
				".content")
			.style.transform = "translateX(0)") : (document.querySelector(
				".sidebar")
			.style.transform = "translateX(300px)", document.querySelector(
				".content")
			.style.transform = "translateX(300px)")
	}
	768 < document.documentElement.clientWidth || (localStorage.setItem(c,
				!1), (r = document.createElement("button"))
			.classList.add("sidebar-pin"), r.onclick = l, document.body.append(
				r), window.addEventListener("load", function() {
				var n = document.querySelector(".content");
				document.body.onclick = n.onclick = function(e) {
					e.target !== document.body && e.currentTarget !==
						n || "true" === localStorage.getItem(c) &&
						l()
				}
			})),
		function() {
			if (window.$docsify) {
				for (var e = arguments.length, n = new Array(e), t = 0; t <
					e; t++) n[t] = arguments[t];
				$docsify.plugins = n.concat($docsify.plugins || [])
			} else console.error("这是一个docsify插件，请先引用docsify库！")
		}(function(e, n) {
			e.doneEach(function(e, n) {
				var t = s();
				i(t), document.querySelectorAll(
						".sidebar-nav li")
					.forEach(function(e) {
						e.querySelector(
								"ul:not(.app-sub-sidebar)") ?
							e.classList.add("folder") : e.classList
							.add("file")
					}),
					function n(e, t) {
						e && e.childNodes && e.childNodes.forEach(
							function(e) {
								e.classList && e.classList.contains(
									"folder") && (e.classList
									.add("level-".concat(
										t)), window.$docsify &&
									window.$docsify.sidebarDisplayLevel &&
									"number" == typeof window
									.$docsify.sidebarDisplayLevel &&
									t <= window.$docsify
									.sidebarDisplayLevel &&
									e.classList.add(
										"open"), e && 1 <
									e.childNodes.length &&
									n(e.childNodes[1],
										t + 1))
							})
					}(document.querySelector(
						".sidebar-nav > ul"), 1), a(t), n(e)
			}), e.ready(function() {
				document.querySelector(".sidebar-nav")
					.addEventListener("click", o)
			})
		})
});
