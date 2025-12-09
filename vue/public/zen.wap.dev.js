/**
* vue v3.5.22
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var Vue = (function (exports) {
  'use strict';

  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }

  const EMPTY_OBJ = Object.freeze({}) ;
  const EMPTY_ARR = Object.freeze([]) ;
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap(
    "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  const camelizeRE = /-\w/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };

  const GLOBALS_ALLOWED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol";
  const isGloballyAllowed = /* @__PURE__ */ makeMap(GLOBALS_ALLOWED);

  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function stringifyStyle(styles) {
    if (!styles) return "";
    if (isString(styles)) return styles;
    let ret = "";
    for (const key in styles) {
      const value = styles[key];
      if (isString(value) || typeof value === "number") {
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        ret += `${normalizedKey}:${value};`;
      }
    }
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  function normalizeProps(props) {
    if (!props) return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (style) {
      props.style = normalizeStyle(style);
    }
    return props;
  }

  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);

  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  const isBooleanAttr = /* @__PURE__ */ makeMap(
    specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`
  );
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const isKnownHtmlAttr = /* @__PURE__ */ makeMap(
    `accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`
  );
  const isKnownSvgAttr = /* @__PURE__ */ makeMap(
    `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
  );
  function isRenderableAttrValue(value) {
    if (value == null) {
      return false;
    }
    const type = typeof value;
    return type === "string" || type === "number" || type === "boolean";
  }

  const cssVarNameEscapeSymbolsRE = /[ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
  function getEscapedCssVarName(key, doubleEscape) {
    return key.replace(
      cssVarNameEscapeSymbolsRE,
      (s) => `\\${s}`
    );
  }

  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }

  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };

  function normalizeCssVarValue(value) {
    if (value == null) {
      return "initial";
    }
    if (typeof value === "string") {
      return value === "" ? " " : value;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      {
        console.warn(
          "[Vue warn] Invalid value used for CSS binding. Expected a string or a finite number but received:",
          value
        );
      }
    }
    return String(value);
  }

  function warn$2(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }

  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      /**
       * @internal
       */
      this._active = true;
      /**
       * @internal track `on` calls, allow `on` call multiple times
       */
      this._on = 0;
      /**
       * @internal
       */
      this.effects = [];
      /**
       * @internal
       */
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      } else {
        warn$2(`cannot run an inactive effect scope.`);
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    } else if (!failSilently) {
      warn$2(
        `onScopeDispose() is called when there is no active effect scope to be associated with.`
      );
    }
  }

  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      /**
       * @internal
       */
      this.deps = void 0;
      /**
       * @internal
       */
      this.depsTail = void 0;
      /**
       * @internal
       */
      this.flags = 1 | 4;
      /**
       * @internal
       */
      this.next = void 0;
      /**
       * @internal
       */
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        if (activeSub !== this) {
          warn$2(
            "Active effect was not restored correctly - this is likely a Vue internal bug."
          );
        }
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed) {
    if (computed.flags & 4 && !(computed.flags & 16)) {
      return;
    }
    computed.flags &= -17;
    if (computed.globalVersion === globalVersion) {
      return;
    }
    computed.globalVersion = globalVersion;
    if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) {
      return;
    }
    computed.flags |= 2;
    const dep = computed.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed;
    shouldTrack = true;
    try {
      prepareDeps(computed);
      const value = computed.fn(computed._value);
      if (dep.version === 0 || hasChanged(value, computed._value)) {
        computed.flags |= 128;
        computed._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed);
      computed.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subsHead === link) {
      dep.subsHead = nextSub;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  function effect(fn, options) {
    if (fn.effect instanceof ReactiveEffect) {
      fn = fn.effect.fn;
    }
    const e = new ReactiveEffect(fn);
    if (options) {
      extend(e, options);
    }
    try {
      e.run();
    } catch (err) {
      e.stop();
      throw err;
    }
    const runner = e.run.bind(e);
    runner.effect = e;
    return runner;
  }
  function stop(runner) {
    runner.effect.stop();
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }

  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed) {
      this.computed = computed;
      this.version = 0;
      /**
       * Link between this dep and the current active effect
       */
      this.activeLink = void 0;
      /**
       * Doubly linked list representing the subscribing effects (tail)
       */
      this.subs = void 0;
      /**
       * For object property deps cleanup
       */
      this.map = void 0;
      this.key = void 0;
      /**
       * Subscriber counter
       */
      this.sc = 0;
      /**
       * @internal
       */
      this.__v_skip = true;
      {
        this.subsHead = void 0;
      }
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      if (activeSub.onTrack) {
        activeSub.onTrack(
          extend(
            {
              effect: activeSub
            },
            debugInfo
          )
        );
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (true) {
          for (let head = this.subsHead; head; head = head.nextSub) {
            if (head.sub.onTrigger && !(head.sub.flags & 8)) {
              head.sub.onTrigger(
                extend(
                  {
                    effect: head.sub
                  },
                  debugInfo
                )
              );
            }
          }
        }
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed = link.dep.computed;
      if (computed && !link.dep.subs) {
        computed.flags |= 4 | 16;
        for (let l = computed.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      if (link.dep.subsHead === void 0) {
        link.dep.subsHead = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    "Object iterate" 
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    "Map keys iterate" 
  );
  const ARRAY_ITERATE_KEY = Symbol(
    "Array iterate" 
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track({
          target,
          type,
          key
        });
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger({
            target,
            type,
            key,
            newValue,
            oldValue,
            oldTarget
          });
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function getDepFromReactive(object, key) {
    const depMap = targetMap.get(object);
    return depMap && depMap.get(key);
  }

  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, toReactive);
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toReactive(value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(this, "filter", fn, thisArg, (v) => v.map(toReactive), arguments);
    },
    find(fn, thisArg) {
      return apply(this, "find", fn, thisArg, toReactive, arguments);
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(this, "findLast", fn, thisArg, toReactive, arguments);
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", toReactive);
    }
  };
  function iterator(self, method, wrapValue) {
    const arr = shallowReadArray(self);
    const iter = arr[method]();
    if (arr !== self && !isShallow(self)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self);
    const needsWrap = arr !== self && !isShallow(self);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toReactive(item), index, self);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self, method, fn, args) {
    const arr = shallowReadArray(self);
    let wrappedFn = fn;
    if (arr !== self) {
      if (!isShallow(self)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toReactive(item), index, self);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self, method, args) {
    const arr = toRaw(self);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self)[method].apply(self, args);
    endBatch();
    resetTracking();
    return res;
  }

  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        const value = targetIsArray && isIntegerKey(key) ? res : res.value;
        return isReadonly2 && isObject(value) ? readonly(value) : value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            {
              warn$2(
                `Set operation on key "${String(key)}" failed: target is readonly.`,
                target[key]
              );
            }
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      {
        warn$2(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
    deleteProperty(target, key) {
      {
        warn$2(
          `Delete operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);

  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        warn$2(
          `${capitalize(type)} operation ${key}failed: target is readonly.`,
          toRaw(this)
        );
      }
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly && track(toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
        !readonly && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0, oldValue);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const oldTarget = isMap(target) ? new Map(target) : new Set(target) ;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0,
              oldTarget
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
      const type = toRawType(target);
      warn$2(
        `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
      );
    }
  }

  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1 /* COMMON */;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2 /* COLLECTION */;
      default:
        return 0 /* INVALID */;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 /* INVALID */ : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      {
        warn$2(
          `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
          target
        )}`
        );
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0 /* INVALID */) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;

  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track({
          target: this,
          type: "get",
          key: "value"
        });
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger({
            target: this,
            type: "set",
            key: "value",
            newValue,
            oldValue
          });
        }
      }
    }
  }
  function triggerRef(ref2) {
    if (ref2.dep) {
      {
        ref2.dep.trigger({
          target: ref2,
          type: "set",
          key: "value",
          newValue: ref2._value
        });
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function toValue(source) {
    return isFunction(source) ? source() : unref(source);
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
    constructor(factory) {
      this["__v_isRef"] = true;
      this._value = void 0;
      const dep = this.dep = new Dep();
      const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
      this._get = get;
      this._set = set;
    }
    get value() {
      return this._value = this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  function toRefs(object) {
    if (!isProxy(object)) {
      warn$2(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this["__v_isRef"] = true;
      this._value = void 0;
    }
    get value() {
      const val = this._object[this._key];
      return this._value = val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(toRaw(this._object), this._key);
    }
  }
  class GetterRefImpl {
    constructor(_getter) {
      this._getter = _getter;
      this["__v_isRef"] = true;
      this["__v_isReadonly"] = true;
      this._value = void 0;
    }
    get value() {
      return this._value = this._getter();
    }
  }
  function toRef(source, key, defaultValue) {
    if (isRef(source)) {
      return source;
    } else if (isFunction(source)) {
      return new GetterRefImpl(source);
    } else if (isObject(source) && arguments.length > 1) {
      return propertyToRef(source, key, defaultValue);
    } else {
      return ref(source);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    const val = source[key];
    return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
  }

  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      /**
       * @internal
       */
      this._value = void 0;
      /**
       * @internal
       */
      this.dep = new Dep(this);
      /**
       * @internal
       */
      this.__v_isRef = true;
      // TODO isolatedDeclarations "__v_isReadonly"
      // A computed is also a subscriber that tracks other deps
      /**
       * @internal
       */
      this.deps = void 0;
      /**
       * @internal
       */
      this.depsTail = void 0;
      /**
       * @internal
       */
      this.flags = 16;
      /**
       * @internal
       */
      this.globalVersion = globalVersion - 1;
      /**
       * @internal
       */
      this.next = void 0;
      // for backwards compat
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track({
        target: this,
        type: "get",
        key: "value"
      }) ;
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      } else {
        warn$2("Write operation failed: computed value is readonly");
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    if (debugOptions && !isSSR) {
      cRef.onTrack = debugOptions.onTrack;
      cRef.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
  }

  const TrackOpTypes = {
    "GET": "get",
    "HAS": "has",
    "ITERATE": "iterate"
  };
  const TriggerOpTypes = {
    "SET": "set",
    "ADD": "add",
    "DELETE": "delete",
    "CLEAR": "clear"
  };

  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function getCurrentWatcher() {
    return activeWatcher;
  }
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    } else if (!failSilently) {
      warn$2(
        `onWatcherCleanup() was called when there was no active watcher to associate with.`
      );
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const warnInvalidSource = (s) => {
      (options.onWarn || warn$2)(
        `Invalid watch source: `,
        s,
        `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
      );
    };
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else {
          warnInvalidSource(s);
        }
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
      warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect = new ReactiveEffect(getter);
    effect.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
    cleanup = effect.onStop = () => {
      const cleanups = cleanupMap.get(effect);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect);
      }
    };
    {
      effect.onTrack = options.onTrack;
      effect.onTrigger = options.onTrigger;
    }
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect.run();
    }
    watchHandle.pause = effect.pause.bind(effect);
    watchHandle.resume = effect.resume.bind(effect);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }

  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  function assertNumber(val, type) {
    if (val === void 0) {
      return;
    } else if (typeof val !== "number") {
      warn$1(`${type} is not a valid number - got ${JSON.stringify(val)}.`);
    } else if (isNaN(val)) {
      warn$1(`${type} is NaN - the duration expression might be incorrect.`);
    }
  }

  const ErrorCodes = {
    "SETUP_FUNCTION": 0,
    "0": "SETUP_FUNCTION",
    "RENDER_FUNCTION": 1,
    "1": "RENDER_FUNCTION",
    "NATIVE_EVENT_HANDLER": 5,
    "5": "NATIVE_EVENT_HANDLER",
    "COMPONENT_EVENT_HANDLER": 6,
    "6": "COMPONENT_EVENT_HANDLER",
    "VNODE_HOOK": 7,
    "7": "VNODE_HOOK",
    "DIRECTIVE_HOOK": 8,
    "8": "DIRECTIVE_HOOK",
    "TRANSITION_HOOK": 9,
    "9": "TRANSITION_HOOK",
    "APP_ERROR_HANDLER": 10,
    "10": "APP_ERROR_HANDLER",
    "APP_WARN_HANDLER": 11,
    "11": "APP_WARN_HANDLER",
    "FUNCTION_REF": 12,
    "12": "FUNCTION_REF",
    "ASYNC_COMPONENT_LOADER": 13,
    "13": "ASYNC_COMPONENT_LOADER",
    "SCHEDULER": 14,
    "14": "SCHEDULER",
    "COMPONENT_UPDATE": 15,
    "15": "COMPONENT_UPDATE",
    "APP_UNMOUNT_CLEANUP": 16,
    "16": "APP_UNMOUNT_CLEANUP"
  };
  const ErrorTypeStrings$1 = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush",
    [15]: "component update",
    [16]: "app unmount cleanup function"
  };
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    } else {
      warn$1(
        `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`
      );
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings$1[type] ;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    {
      const info = ErrorTypeStrings$1[type];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    }
  }

  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    const check = (job) => checkRecursiveUpdates(seen, job) ;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (check(job)) {
            continue;
          }
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs(seen);
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn) {
    const count = seen.get(fn) || 0;
    if (count > RECURSION_LIMIT) {
      const instance = fn.i;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    }
    seen.set(fn, count + 1);
    return false;
  }

  let isHmrUpdating = false;
  const hmrDirtyComponents = /* @__PURE__ */ new Map();
  {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = /* @__PURE__ */ new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
      createRecord(id, instance.type);
      record = map.get(id);
    }
    record.instances.add(instance);
  }
  function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).instances.delete(instance);
  }
  function createRecord(id, initialDef) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      if (!(instance.job.flags & 8)) {
        instance.update();
      }
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record) return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];
      const oldComp = normalizeClassComponent(instance.type);
      let dirtyInstances = hmrDirtyComponents.get(oldComp);
      if (!dirtyInstances) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.set(oldComp, dirtyInstances = /* @__PURE__ */ new Set());
      }
      dirtyInstances.add(instance);
      instance.appContext.propsCache.delete(instance.type);
      instance.appContext.emitsCache.delete(instance.type);
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        dirtyInstances.add(instance);
        instance.ceReload(newComp.styles);
        dirtyInstances.delete(instance);
      } else if (instance.parent) {
        queueJob(() => {
          if (!(instance.job.flags & 8)) {
            isHmrUpdating = true;
            instance.parent.update();
            isHmrUpdating = false;
            dirtyInstances.delete(instance);
          }
        });
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn(
          "[HMR] Root or manually mounted instance modified. Full reload required."
        );
      }
      if (instance.root.ce && instance !== instance.root) {
        instance.root.ce._removeChildStyle(oldComp);
      }
    }
    queuePostFlushCb(() => {
      hmrDirtyComponents.clear();
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn) {
    return (id, arg) => {
      try {
        return fn(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(
          `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
        );
      }
    };
  }

  let devtools$1;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools$1) {
      devtools$1.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook$1(hook, target) {
    var _a, _b;
    devtools$1 = hook;
    if (devtools$1) {
      devtools$1.enabled = true;
      buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      // eslint-disable-next-line no-restricted-syntax
      !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook$1(newHook, target);
      });
      setTimeout(() => {
        if (!devtools$1) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version) {
    emit$1("app:init" /* APP_INIT */, app, version, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount" /* APP_UNMOUNT */, app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook("component:added" /* COMPONENT_ADDED */);
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated" /* COMPONENT_UPDATED */);
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed" /* COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools$1.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  // @__NO_SIDE_EFFECTS__
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(
        hook,
        component.appContext.app,
        component.uid,
        component.parent ? component.parent.uid : void 0,
        component
      );
    };
  }
  const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook("perf:start" /* PERFORMANCE_START */);
  const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook("perf:end" /* PERFORMANCE_END */);
  function createDevtoolsPerformanceHook(hook) {
    return (component, type, time) => {
      emit$1(hook, component.appContext.app, component.uid, component, type, time);
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1(
      "component:emit" /* COMPONENT_EMIT */,
      component.appContext.app,
      component,
      event,
      params
    );
  }

  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  const withScopeId = (_id) => withCtx;
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      {
        devtoolsComponentUpdated(ctx);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }

  function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) {
      warn$1("Do not use built-in directive ids as custom directive id: " + name);
    }
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      warn$1(`withDirectives can only be used inside render functions.`);
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }

  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        warn$1(
          `Current renderer does not support string target for Teleports. (missing querySelector renderer option)`
        );
        return null;
      } else {
        const target = select(targetSelector);
        if (!target && !isTeleportDisabled(props)) {
          warn$1(
            `Failed to locate Teleport target with selector "${targetSelector}". Note the target element must exist before the component is mounted - i.e. the target cannot be rendered by the component itself, and ideally should be outside of the entire Vue component tree.`
          );
        }
        return target;
      }
    } else {
      if (!targetSelector && !isTeleportDisabled(props)) {
        warn$1(`Invalid Teleport target: ${targetSelector}`);
      }
      return targetSelector;
    }
  };
  const TeleportImpl = {
    name: "Teleport",
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (isHmrUpdating) {
        optimized = false;
        dynamicChildren = null;
      }
      if (n1 == null) {
        const placeholder = n2.el = createComment("teleport start") ;
        const mainAnchor = n2.anchor = createComment("teleport end") ;
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        };
        const mountToTarget = () => {
          const target = n2.target = resolveTarget(n2.props, querySelector);
          const targetAnchor = prepareAnchor(target, n2, createText, insert);
          if (target) {
            if (namespace !== "svg" && isTargetSVG(target)) {
              namespace = "svg";
            } else if (namespace !== "mathml" && isTargetMathML(target)) {
              namespace = "mathml";
            }
            if (parentComponent && parentComponent.isCE) {
              (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
            }
            if (!disabled) {
              mount(target, targetAnchor);
              updateCssVars(n2, false);
            }
          } else if (!disabled) {
            warn$1(
              "Invalid Teleport target on mount:",
              target,
              `(${typeof target})`
            );
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
          updateCssVars(n2, true);
        }
        if (isTeleportDeferred(n2.props)) {
          n2.el.__isMounted = false;
          queuePostRenderEffect(() => {
            mountToTarget();
            delete n2.el.__isMounted;
          }, parentSuspense);
        } else {
          mountToTarget();
        }
      } else {
        if (isTeleportDeferred(n2.props) && n1.el.__isMounted === false) {
          queuePostRenderEffect(() => {
            TeleportImpl.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          }, parentSuspense);
          return;
        }
        n2.el = n1.el;
        n2.targetStart = n1.targetStart;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, false);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          } else {
            if (n2.props && n1.props && n2.props.to !== n1.props.to) {
              n2.props.to = n1.props.to;
            }
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            } else {
              warn$1(
                "Invalid Teleport target on update:",
                target,
                `(${typeof target})`
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
        updateCssVars(n2, disabled);
      }
    },
    remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const {
        shapeFlag,
        children,
        anchor,
        targetStart,
        targetAnchor,
        target,
        props
      } = vnode;
      if (target) {
        hostRemove(targetStart);
        hostRemove(targetAnchor);
      }
      doRemove && hostRemove(anchor);
      if (shapeFlag & 16) {
        const shouldRemove = doRemove || !isTeleportDisabled(props);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            shouldRemove,
            !!child.dynamicChildren
          );
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector, insert, createText }
  }, hydrateChildren) {
    function hydrateDisabledTeleport(node2, vnode2, targetStart, targetAnchor) {
      vnode2.anchor = hydrateChildren(
        nextSibling(node2),
        vnode2,
        parentNode(node2),
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      vnode2.targetStart = targetStart;
      vnode2.targetAnchor = targetAnchor;
    }
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    const disabled = isTeleportDisabled(vnode.props);
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (disabled) {
          hydrateDisabledTeleport(
            node,
            vnode,
            targetNode,
            targetNode && nextSibling(targetNode)
          );
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            if (targetAnchor && targetAnchor.nodeType === 8) {
              if (targetAnchor.data === "teleport start anchor") {
                vnode.targetStart = targetAnchor;
              } else if (targetAnchor.data === "teleport anchor") {
                vnode.targetAnchor = targetAnchor;
                target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
                break;
              }
            }
            targetAnchor = nextSibling(targetAnchor);
          }
          if (!vnode.targetAnchor) {
            prepareAnchor(target, vnode, createText, insert);
          }
          hydrateChildren(
            targetNode && nextSibling(targetNode),
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
      }
      updateCssVars(vnode, disabled);
    } else if (disabled) {
      if (vnode.shapeFlag & 16) {
        hydrateDisabledTeleport(node, vnode, node, nextSibling(node));
      }
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode, isDisabled) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node, anchor;
      if (isDisabled) {
        node = vnode.el;
        anchor = vnode.anchor;
      } else {
        node = vnode.targetStart;
        anchor = vnode.targetAnchor;
      }
      while (node && node !== anchor) {
        if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }
  function prepareAnchor(target, vnode, createText, insert) {
    const targetStart = vnode.targetStart = createText("");
    const targetAnchor = vnode.targetAnchor = createText("");
    targetStart[TeleportEndKey] = targetAnchor;
    if (target) {
      insert(targetStart, target);
      insert(targetAnchor, target);
    }
    return targetAnchor;
  }

  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey$1 = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const recursiveGetSubtree = (instance) => {
    const subTree = instance.subTree;
    return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        const child = findNonCommentChild(children);
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if (mode && mode !== "in-out" && mode !== "out-in" && mode !== "default") {
          warn$1(`invalid <transition> mode: ${mode}`);
        }
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getInnerChild$1(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        let enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance,
          // #11061, ensure enterHooks is fresh after clone
          (hooks) => enterHooks = hooks
        );
        if (innerChild.type !== Comment) {
          setTransitionHooks(innerChild, enterHooks);
        }
        let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
        if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
          let leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in" && innerChild.type !== Comment) {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (!(instance.job.flags & 8)) {
                instance.update();
              }
              delete leavingHooks.afterLeave;
              oldInnerChild = void 0;
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el[leaveCbKey] = () => {
                earlyRemove();
                el[leaveCbKey] = void 0;
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
              enterHooks.delayedLeave = () => {
                delayedLeave();
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
            };
          } else {
            oldInnerChild = void 0;
          }
        } else if (oldInnerChild) {
          oldInnerChild = void 0;
        }
        return child;
      };
    }
  };
  function findNonCommentChild(children) {
    let child = children[0];
    if (children.length > 1) {
      let hasFound = false;
      for (const c of children) {
        if (c.type !== Comment) {
          if (hasFound) {
            warn$1(
              "<transition> can only be used on a single element or component. Use <transition-group> for lists."
            );
            break;
          }
          child = c;
          hasFound = true;
        }
      }
    }
    return child;
  }
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance, postClone) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey$1] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook(cancelHook, [el]);
          } else {
            callHook(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey$1] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove) {
        const key2 = String(vnode.key);
        if (el[enterCbKey$1]) {
          el[enterCbKey$1](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove();
        }
        callHook(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove();
          if (cancelled) {
            callHook(onLeaveCancelled, [el]);
          } else {
            callHook(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        const hooks2 = resolveTransitionHooks(
          vnode2,
          props,
          state,
          instance,
          postClone
        );
        if (postClone) postClone(hooks2);
        return hooks2;
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getInnerChild$1(vnode) {
    if (!isKeepAlive(vnode)) {
      if (isTeleport(vnode.type) && vnode.children) {
        return findNonCommentChild(vnode.children);
      }
      return vnode;
    }
    if (vnode.component) {
      return vnode.component.subTree;
    }
    const { shapeFlag, children } = vnode;
    if (children) {
      if (shapeFlag & 16) {
        return children[0];
      }
      if (shapeFlag & 32 && isFunction(children.default)) {
        return children.default();
      }
    }
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128) keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }

  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }

  function useId() {
    const i = getCurrentInstance();
    if (i) {
      return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
    } else {
      warn$1(
        `useId() is called when there is no active component instance to be associated with.`
      );
    }
    return "";
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }

  const knownTemplateRefs = /* @__PURE__ */ new WeakSet();
  function useTemplateRef(key) {
    const i = getCurrentInstance();
    const r = shallowRef(null);
    if (i) {
      const refs = i.refs === EMPTY_OBJ ? i.refs = {} : i.refs;
      let desc;
      if ((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable) {
        warn$1(`useTemplateRef('${key}') already exists.`);
      } else {
        Object.defineProperty(refs, key, {
          enumerable: true,
          get: () => r.value,
          set: (val) => r.value = val
        });
      }
    } else {
      warn$1(
        `useTemplateRef() is called when there is no active component instance to be associated with.`
      );
    }
    const ret = readonly(r) ;
    {
      knownTemplateRefs.add(ret);
    }
    return ret;
  }

  const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref } = rawRef;
    if (!owner) {
      warn$1(
        `Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`
      );
      return;
    }
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      {
        if (hasOwn(rawSetupState, key) && !isRef(rawSetupState[key])) {
          warn$1(
            `Template ref "${key}" used on a non-ref value. It will not work in the production build.`
          );
        }
        if (knownTemplateRefs.has(rawSetupState[key])) {
          return false;
        }
      }
      return hasOwn(rawSetupState, key);
    };
    const canSetRef = (ref2) => {
      return !knownTemplateRefs.has(ref2);
    };
    if (oldRef != null && oldRef !== ref) {
      invalidatePendingSetRef(oldRawRef);
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        if (canSetRef(oldRef)) {
          oldRef.value = null;
        }
        const oldRawRefAtom = oldRawRef;
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction(ref)) {
      callWithErrorHandling(ref, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref);
      const _isRef = isRef(ref);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref] = [refValue];
                  if (canSetSetupRef(ref)) {
                    setupState[ref] = refs[ref];
                  }
                } else {
                  const newVal = [refValue];
                  if (canSetRef(ref)) {
                    ref.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref] = value;
            if (canSetSetupRef(ref)) {
              setupState[ref] = value;
            }
          } else if (_isRef) {
            if (canSetRef(ref)) {
              ref.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else {
            warn$1("Invalid template ref type:", ref, `(${typeof ref})`);
          }
        };
        if (value) {
          const job = () => {
            doSet();
            pendingSetRefMap.delete(rawRef);
          };
          job.id = -1;
          pendingSetRefMap.set(rawRef, job);
          queuePostRenderEffect(job, parentSuspense);
        } else {
          invalidatePendingSetRef(rawRef);
          doSet();
        }
      } else {
        warn$1("Invalid template ref type:", ref, `(${typeof ref})`);
      }
    }
  }
  function invalidatePendingSetRef(rawRef) {
    const pendingSetRef = pendingSetRefMap.get(rawRef);
    if (pendingSetRef) {
      pendingSetRef.flags |= 8;
      pendingSetRefMap.delete(rawRef);
    }
  }

  let hasLoggedMismatchError = false;
  const logMismatchError = () => {
    if (hasLoggedMismatchError) {
      return;
    }
    console.error("Hydration completed but contains mismatches.");
    hasLoggedMismatchError = true;
  };
  const isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
  const isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
  const getContainerType = (container) => {
    if (container.nodeType !== 1) return void 0;
    if (isSVGContainer(container)) return "svg";
    if (isMathMLContainer(container)) return "mathml";
    return void 0;
  };
  const isComment = (node) => node.nodeType === 8;
  function createHydrationFunctions(rendererInternals) {
    const {
      mt: mountComponent,
      p: patch,
      o: {
        patchProp,
        createText,
        nextSibling,
        parentNode,
        remove,
        insert,
        createComment
      }
    } = rendererInternals;
    const hydrate = (vnode, container) => {
      if (!container.hasChildNodes()) {
        warn$1(
          `Attempting to hydrate existing markup but container is empty. Performing full mount instead.`
        );
        patch(null, vnode, container);
        flushPostFlushCbs();
        container._vnode = vnode;
        return;
      }
      hydrateNode(container.firstChild, vnode, null, null, null);
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const isFragmentStart = isComment(node) && node.data === "[";
      const onMismatch = () => handleMismatch(
        node,
        vnode,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        isFragmentStart
      );
      const { type, ref, shapeFlag, patchFlag } = vnode;
      let domType = node.nodeType;
      vnode.el = node;
      {
        def(node, "__vnode", vnode, true);
        def(node, "__vueParentComponent", parentComponent, true);
      }
      if (patchFlag === -2) {
        optimized = false;
        vnode.dynamicChildren = null;
      }
      let nextNode = null;
      switch (type) {
        case Text:
          if (domType !== 3) {
            if (vnode.children === "") {
              insert(vnode.el = createText(""), parentNode(node), node);
              nextNode = node;
            } else {
              nextNode = onMismatch();
            }
          } else {
            if (node.data !== vnode.children) {
              warn$1(
                `Hydration text mismatch in`,
                node.parentNode,
                `
  - rendered on server: ${JSON.stringify(
                node.data
              )}
  - expected on client: ${JSON.stringify(vnode.children)}`
              );
              logMismatchError();
              node.data = vnode.children;
            }
            nextNode = nextSibling(node);
          }
          break;
        case Comment:
          if (isTemplateNode(node)) {
            nextNode = nextSibling(node);
            replaceNode(
              vnode.el = node.content.firstChild,
              node,
              parentComponent
            );
          } else if (domType !== 8 || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }
          break;
        case Static:
          if (isFragmentStart) {
            node = nextSibling(node);
            domType = node.nodeType;
          }
          if (domType === 1 || domType === 3) {
            nextNode = node;
            const needToAdoptContent = !vnode.children.length;
            for (let i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent)
                vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }
              nextNode = nextSibling(nextNode);
            }
            return isFragmentStart ? nextSibling(nextNode) : nextNode;
          } else {
            onMismatch();
          }
          break;
        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
          break;
        default:
          if (shapeFlag & 1) {
            if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
            }
          } else if (shapeFlag & 6) {
            vnode.slotScopeIds = slotScopeIds;
            const container = parentNode(node);
            if (isFragmentStart) {
              nextNode = locateClosingAnchor(node);
            } else if (isComment(node) && node.data === "teleport start") {
              nextNode = locateClosingAnchor(node, node.data, "teleport end");
            } else {
              nextNode = nextSibling(node);
            }
            mountComponent(
              vnode,
              container,
              null,
              parentComponent,
              parentSuspense,
              getContainerType(container),
              optimized
            );
            if (isAsyncWrapper(vnode) && !vnode.type.__asyncResolved) {
              let subTree;
              if (isFragmentStart) {
                subTree = createVNode(Fragment);
                subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
              } else {
                subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
              }
              subTree.el = node;
              vnode.component.subTree = subTree;
            }
          } else if (shapeFlag & 64) {
            if (domType !== 8) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized,
                rendererInternals,
                hydrateChildren
              );
            }
          } else if (shapeFlag & 128) {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              getContainerType(parentNode(node)),
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateNode
            );
          } else {
            warn$1("Invalid HostVNode type:", type, `(${typeof type})`);
          }
      }
      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode);
      }
      return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
      const forcePatch = type === "input" || type === "option";
      {
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        let needCallTransitionHooks = false;
        if (isTemplateNode(el)) {
          needCallTransitionHooks = needTransition(
            null,
            // no need check parentSuspense in hydration
            transition
          ) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
          const content = el.content.firstChild;
          if (needCallTransitionHooks) {
            const cls = content.getAttribute("class");
            if (cls) content.$cls = cls;
            transition.beforeEnter(content);
          }
          replaceNode(content, el, parentComponent);
          vnode.el = el = content;
        }
        if (shapeFlag & 16 && // skip if element has innerHTML / textContent
        !(props && (props.innerHTML || props.textContent))) {
          let next = hydrateChildren(
            el.firstChild,
            vnode,
            el,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          let hasWarned = false;
          while (next) {
            if (!isMismatchAllowed(el, 1 /* CHILDREN */)) {
              if (!hasWarned) {
                warn$1(
                  `Hydration children mismatch on`,
                  el,
                  `
Server rendered element contains more child nodes than client vdom.`
                );
                hasWarned = true;
              }
              logMismatchError();
            }
            const cur = next;
            next = next.nextSibling;
            remove(cur);
          }
        } else if (shapeFlag & 8) {
          let clientText = vnode.children;
          if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) {
            clientText = clientText.slice(1);
          }
          if (el.textContent !== clientText) {
            if (!isMismatchAllowed(el, 0 /* TEXT */)) {
              warn$1(
                `Hydration text content mismatch on`,
                el,
                `
  - rendered on server: ${el.textContent}
  - expected on client: ${vnode.children}`
              );
              logMismatchError();
            }
            el.textContent = vnode.children;
          }
        }
        if (props) {
          {
            const isCustomElement = el.tagName.includes("-");
            for (const key in props) {
              if (// #11189 skip if this node has directives that have created hooks
              // as it could have mutated the DOM in any possible way
              !(dirs && dirs.some((d) => d.dir.created)) && propHasMismatch(el, key, props[key], vnode, parentComponent)) {
                logMismatchError();
              }
              if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || // force hydrate v-bind with .prop modifiers
              key[0] === "." || isCustomElement) {
                patchProp(el, key, null, props[key], void 0, parentComponent);
              }
            }
          }
        }
        let vnodeHooks;
        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            needCallTransitionHooks && transition.enter(el);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
      }
      return el.nextSibling;
    };
    const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!parentVNode.dynamicChildren;
      const children = parentVNode.children;
      const l = children.length;
      let hasWarned = false;
      for (let i = 0; i < l; i++) {
        const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
        const isText = vnode.type === Text;
        if (node) {
          if (isText && !optimized) {
            if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
              insert(
                createText(
                  node.data.slice(vnode.children.length)
                ),
                container,
                nextSibling(node)
              );
              node.data = vnode.children;
            }
          }
          node = hydrateNode(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        } else if (isText && !vnode.children) {
          insert(vnode.el = createText(""), container);
        } else {
          if (!isMismatchAllowed(container, 1 /* CHILDREN */)) {
            if (!hasWarned) {
              warn$1(
                `Hydration children mismatch on`,
                container,
                `
Server rendered element contains fewer child nodes than client vdom.`
              );
              hasWarned = true;
            }
            logMismatchError();
          }
          patch(
            null,
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            getContainerType(container),
            slotScopeIds
          );
        }
      }
      return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      const { slotScopeIds: fragmentSlotScopeIds } = vnode;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      const container = parentNode(node);
      const next = hydrateChildren(
        nextSibling(node),
        vnode,
        container,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      if (next && isComment(next) && next.data === "]") {
        return nextSibling(vnode.anchor = next);
      } else {
        logMismatchError();
        insert(vnode.anchor = createComment(`]`), container, next);
        return next;
      }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
      if (!isMismatchAllowed(node.parentElement, 1 /* CHILDREN */)) {
        warn$1(
          `Hydration node mismatch:
- rendered on server:`,
          node,
          node.nodeType === 3 ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``,
          `
- expected on client:`,
          vnode.type
        );
        logMismatchError();
      }
      vnode.el = null;
      if (isFragment) {
        const end = locateClosingAnchor(node);
        while (true) {
          const next2 = nextSibling(node);
          if (next2 && next2 !== end) {
            remove(next2);
          } else {
            break;
          }
        }
      }
      const next = nextSibling(node);
      const container = parentNode(node);
      remove(node);
      patch(
        null,
        vnode,
        container,
        next,
        parentComponent,
        parentSuspense,
        getContainerType(container),
        slotScopeIds
      );
      if (parentComponent) {
        parentComponent.vnode.el = vnode.el;
        updateHOCHostEl(parentComponent, vnode.el);
      }
      return next;
    };
    const locateClosingAnchor = (node, open = "[", close = "]") => {
      let match = 0;
      while (node) {
        node = nextSibling(node);
        if (node && isComment(node)) {
          if (node.data === open) match++;
          if (node.data === close) {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }
      return node;
    };
    const replaceNode = (newNode, oldNode, parentComponent) => {
      const parentNode2 = oldNode.parentNode;
      if (parentNode2) {
        parentNode2.replaceChild(newNode, oldNode);
      }
      let parent = parentComponent;
      while (parent) {
        if (parent.vnode.el === oldNode) {
          parent.vnode.el = parent.subTree.el = newNode;
        }
        parent = parent.parent;
      }
    };
    const isTemplateNode = (node) => {
      return node.nodeType === 1 && node.tagName === "TEMPLATE";
    };
    return [hydrate, hydrateNode];
  }
  function propHasMismatch(el, key, clientValue, vnode, instance) {
    let mismatchType;
    let mismatchKey;
    let actual;
    let expected;
    if (key === "class") {
      if (el.$cls) {
        actual = el.$cls;
        delete el.$cls;
      } else {
        actual = el.getAttribute("class");
      }
      expected = normalizeClass(clientValue);
      if (!isSetEqual(toClassSet(actual || ""), toClassSet(expected))) {
        mismatchType = 2 /* CLASS */;
        mismatchKey = `class`;
      }
    } else if (key === "style") {
      actual = el.getAttribute("style") || "";
      expected = isString(clientValue) ? clientValue : stringifyStyle(normalizeStyle(clientValue));
      const actualMap = toStyleMap(actual);
      const expectedMap = toStyleMap(expected);
      if (vnode.dirs) {
        for (const { dir, value } of vnode.dirs) {
          if (dir.name === "show" && !value) {
            expectedMap.set("display", "none");
          }
        }
      }
      if (instance) {
        resolveCssVars(instance, vnode, expectedMap);
      }
      if (!isMapEqual(actualMap, expectedMap)) {
        mismatchType = 3 /* STYLE */;
        mismatchKey = "style";
      }
    } else if (el instanceof SVGElement && isKnownSvgAttr(key) || el instanceof HTMLElement && (isBooleanAttr(key) || isKnownHtmlAttr(key))) {
      if (isBooleanAttr(key)) {
        actual = el.hasAttribute(key);
        expected = includeBooleanAttr(clientValue);
      } else if (clientValue == null) {
        actual = el.hasAttribute(key);
        expected = false;
      } else {
        if (el.hasAttribute(key)) {
          actual = el.getAttribute(key);
        } else if (key === "value" && el.tagName === "TEXTAREA") {
          actual = el.value;
        } else {
          actual = false;
        }
        expected = isRenderableAttrValue(clientValue) ? String(clientValue) : false;
      }
      if (actual !== expected) {
        mismatchType = 4 /* ATTRIBUTE */;
        mismatchKey = key;
      }
    }
    if (mismatchType != null && !isMismatchAllowed(el, mismatchType)) {
      const format = (v) => v === false ? `(not rendered)` : `${mismatchKey}="${v}"`;
      const preSegment = `Hydration ${MismatchTypeString[mismatchType]} mismatch on`;
      const postSegment = `
  - rendered on server: ${format(actual)}
  - expected on client: ${format(expected)}
  Note: this mismatch is check-only. The DOM will not be rectified in production due to performance overhead.
  You should fix the source of the mismatch.`;
      {
        warn$1(preSegment, el, postSegment);
      }
      return true;
    }
    return false;
  }
  function toClassSet(str) {
    return new Set(str.trim().split(/\s+/));
  }
  function isSetEqual(a, b) {
    if (a.size !== b.size) {
      return false;
    }
    for (const s of a) {
      if (!b.has(s)) {
        return false;
      }
    }
    return true;
  }
  function toStyleMap(str) {
    const styleMap = /* @__PURE__ */ new Map();
    for (const item of str.split(";")) {
      let [key, value] = item.split(":");
      key = key.trim();
      value = value && value.trim();
      if (key && value) {
        styleMap.set(key, value);
      }
    }
    return styleMap;
  }
  function isMapEqual(a, b) {
    if (a.size !== b.size) {
      return false;
    }
    for (const [key, value] of a) {
      if (value !== b.get(key)) {
        return false;
      }
    }
    return true;
  }
  function resolveCssVars(instance, vnode, expectedMap) {
    const root = instance.subTree;
    if (instance.getCssVars && (vnode === root || root && root.type === Fragment && root.children.includes(vnode))) {
      const cssVars = instance.getCssVars();
      for (const key in cssVars) {
        const value = normalizeCssVarValue(cssVars[key]);
        expectedMap.set(`--${getEscapedCssVarName(key)}`, value);
      }
    }
    if (vnode === root && instance.parent) {
      resolveCssVars(instance.parent, instance.vnode, expectedMap);
    }
  }
  const allowMismatchAttr = "data-allow-mismatch";
  const MismatchTypeString = {
    [0 /* TEXT */]: "text",
    [1 /* CHILDREN */]: "children",
    [2 /* CLASS */]: "class",
    [3 /* STYLE */]: "style",
    [4 /* ATTRIBUTE */]: "attribute"
  };
  function isMismatchAllowed(el, allowedType) {
    if (allowedType === 0 /* TEXT */ || allowedType === 1 /* CHILDREN */) {
      while (el && !el.hasAttribute(allowMismatchAttr)) {
        el = el.parentElement;
      }
    }
    const allowedAttr = el && el.getAttribute(allowMismatchAttr);
    if (allowedAttr == null) {
      return false;
    } else if (allowedAttr === "") {
      return true;
    } else {
      const list = allowedAttr.split(",");
      if (allowedType === 0 /* TEXT */ && list.includes("children")) {
        return true;
      }
      return list.includes(MismatchTypeString[allowedType]);
    }
  }

  const requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  const cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const hydrateOnIdle = (timeout = 1e4) => (hydrate) => {
    const id = requestIdleCallback(hydrate, { timeout });
    return () => cancelIdleCallback(id);
  };
  function elementIsVisibleInViewport(el) {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth);
  }
  const hydrateOnVisible = (opts) => (hydrate, forEach) => {
    const ob = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        ob.disconnect();
        hydrate();
        break;
      }
    }, opts);
    forEach((el) => {
      if (!(el instanceof Element)) return;
      if (elementIsVisibleInViewport(el)) {
        hydrate();
        ob.disconnect();
        return false;
      }
      ob.observe(el);
    });
    return () => ob.disconnect();
  };
  const hydrateOnMediaQuery = (query) => (hydrate) => {
    if (query) {
      const mql = matchMedia(query);
      if (mql.matches) {
        hydrate();
      } else {
        mql.addEventListener("change", hydrate, { once: true });
        return () => mql.removeEventListener("change", hydrate);
      }
    }
  };
  const hydrateOnInteraction = (interactions = []) => (hydrate, forEach) => {
    if (isString(interactions)) interactions = [interactions];
    let hasHydrated = false;
    const doHydrate = (e) => {
      if (!hasHydrated) {
        hasHydrated = true;
        teardown();
        hydrate();
        e.target.dispatchEvent(new e.constructor(e.type, e));
      }
    };
    const teardown = () => {
      forEach((el) => {
        for (const i of interactions) {
          el.removeEventListener(i, doHydrate);
        }
      });
    };
    forEach((el) => {
      for (const i of interactions) {
        el.addEventListener(i, doHydrate, { once: true });
      }
    });
    return teardown;
  };
  function forEachElement(node, cb) {
    if (isComment(node) && node.data === "[") {
      let depth = 1;
      let next = node.nextSibling;
      while (next) {
        if (next.nodeType === 1) {
          const result = cb(next);
          if (result === false) {
            break;
          }
        } else if (isComment(next)) {
          if (next.data === "]") {
            if (--depth === 0) break;
          } else if (next.data === "[") {
            depth++;
          }
        }
        next = next.nextSibling;
      }
    } else {
      cb(node);
    }
  }

  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  // @__NO_SIDE_EFFECTS__
  function defineAsyncComponent(source) {
    if (isFunction(source)) {
      source = { loader: source };
    }
    const {
      loader,
      loadingComponent,
      errorComponent,
      delay = 200,
      hydrate: hydrateStrategy,
      timeout,
      // undefined = never times out
      suspensible = true,
      onError: userOnError
    } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };
    const load = () => {
      let thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        if (userOnError) {
          return new Promise((resolve, reject) => {
            const userRetry = () => resolve(retry());
            const userFail = () => reject(err);
            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then((comp) => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        }
        if (!comp) {
          warn$1(
            `Async component loader resolved to undefined. If you are using retry(), make sure to return its return value.`
          );
        }
        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
          comp = comp.default;
        }
        if (comp && !isObject(comp) && !isFunction(comp)) {
          throw new Error(`Invalid async component load result: ${comp}`);
        }
        resolvedComp = comp;
        return comp;
      }));
    };
    return defineComponent({
      name: "AsyncComponentWrapper",
      __asyncLoader: load,
      __asyncHydrate(el, instance, hydrate) {
        let patched = false;
        (instance.bu || (instance.bu = [])).push(() => patched = true);
        const performHydrate = () => {
          if (patched) {
            {
              warn$1(
                `Skipping lazy hydration for component '${getComponentName(resolvedComp) || resolvedComp.__file}': it was updated before lazy hydration performed.`
              );
            }
            return;
          }
          hydrate();
        };
        const doHydrate = hydrateStrategy ? () => {
          const teardown = hydrateStrategy(
            performHydrate,
            (cb) => forEachElement(el, cb)
          );
          if (teardown) {
            (instance.bum || (instance.bum = [])).push(teardown);
          }
        } : performHydrate;
        if (resolvedComp) {
          doHydrate();
        } else {
          load().then(() => !instance.isUnmounted && doHydrate());
        }
      },
      get __asyncResolved() {
        return resolvedComp;
      },
      setup() {
        const instance = currentInstance;
        markAsyncBoundary(instance);
        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }
        const onError = (err) => {
          pendingRequest = null;
          handleError(
            err,
            instance,
            13,
            !errorComponent
          );
        };
        if (suspensible && instance.suspense || false) {
          return load().then((comp) => {
            return () => createInnerComp(comp, instance);
          }).catch((err) => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {
              error: err
            }) : null;
          });
        }
        const loaded = ref(false);
        const error = ref();
        const delayed = ref(!!delay);
        if (delay) {
          setTimeout(() => {
            delayed.value = false;
          }, delay);
        }
        if (timeout != null) {
          setTimeout(() => {
            if (!loaded.value && !error.value) {
              const err = new Error(
                `Async component timed out after ${timeout}ms.`
              );
              onError(err);
              error.value = err;
            }
          }, timeout);
        }
        load().then(() => {
          loaded.value = true;
          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            instance.parent.update();
          }
        }).catch((err) => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }
    });
  }
  function createInnerComp(comp, parent) {
    const { ref: ref2, props, children, ce } = parent.vnode;
    const vnode = createVNode(comp, props, children);
    vnode.ref = ref2;
    vnode.ce = ce;
    delete parent.vnode.ce;
    return vnode;
  }

  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const sharedContext = instance.ctx;
      const cache = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set();
      let current = null;
      {
        instance.__v_cache = cache;
      }
      const parentSuspense = instance.suspense;
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext;
      const storageContainer = createElement("div");
      sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
        const instance2 = vnode.component;
        move(vnode, container, anchor, 0, parentSuspense);
        patch(
          instance2.vnode,
          vnode,
          container,
          anchor,
          instance2,
          parentSuspense,
          namespace,
          vnode.slotScopeIds,
          optimized
        );
        queuePostRenderEffect(() => {
          instance2.isDeactivated = false;
          if (instance2.a) {
            invokeArrayFns(instance2.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
        }, parentSuspense);
        {
          devtoolsComponentAdded(instance2);
        }
      };
      sharedContext.deactivate = (vnode) => {
        const instance2 = vnode.component;
        invalidateMount(instance2.m);
        invalidateMount(instance2.a);
        move(vnode, storageContainer, null, 1, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance2.da) {
            invokeArrayFns(instance2.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
          instance2.isDeactivated = true;
        }, parentSuspense);
        {
          devtoolsComponentAdded(instance2);
        }
        {
          instance2.__keepAliveStorageContainer = storageContainer;
        }
      };
      function unmount(vnode) {
        resetShapeFlag(vnode);
        _unmount(vnode, instance, parentSuspense, true);
      }
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type);
          if (name && !filter(name)) {
            pruneCacheEntry(key);
          }
        });
      }
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (cached && (!current || !isSameVNodeType(cached, current))) {
          unmount(cached);
        } else if (current) {
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache((name) => matches(include, name));
          exclude && pruneCache((name) => !matches(exclude, name));
        },
        // prune post-render after `current` has been updated
        { flush: "post", deep: true }
      );
      let pendingCacheKey = null;
      const cacheSubtree = () => {
        if (pendingCacheKey != null) {
          if (isSuspense(instance.subTree.type)) {
            queuePostRenderEffect(() => {
              cache.set(pendingCacheKey, getInnerChild(instance.subTree));
            }, instance.subTree.suspense);
          } else {
            cache.set(pendingCacheKey, getInnerChild(instance.subTree));
          }
        }
      };
      onMounted(cacheSubtree);
      onUpdated(cacheSubtree);
      onBeforeUnmount(() => {
        cache.forEach((cached) => {
          const { subTree, suspense } = instance;
          const vnode = getInnerChild(subTree);
          if (cached.type === vnode.type && cached.key === vnode.key) {
            resetShapeFlag(vnode);
            const da = vnode.component.da;
            da && queuePostRenderEffect(da, suspense);
            return;
          }
          unmount(cached);
        });
      });
      return () => {
        pendingCacheKey = null;
        if (!slots.default) {
          return current = null;
        }
        const children = slots.default();
        const rawVNode = children[0];
        if (children.length > 1) {
          {
            warn$1(`KeepAlive should contain exactly one component child.`);
          }
          current = null;
          return children;
        } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
          current = null;
          return rawVNode;
        }
        let vnode = getInnerChild(rawVNode);
        if (vnode.type === Comment) {
          current = null;
          return vnode;
        }
        const comp = vnode.type;
        const name = getComponentName(
          isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
        );
        const { include, exclude, max } = props;
        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          vnode.shapeFlag &= -257;
          current = vnode;
          return rawVNode;
        }
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        if (vnode.el) {
          vnode = cloneVNode(vnode);
          if (rawVNode.shapeFlag & 128) {
            rawVNode.ssContent = vnode;
          }
        }
        pendingCacheKey = key;
        if (cachedVNode) {
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;
          if (vnode.transition) {
            setTransitionHooks(vnode, vnode.transition);
          }
          vnode.shapeFlag |= 512;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlag |= 256;
        current = vnode;
        return isSuspense(rawVNode.type) ? rawVNode : vnode;
      };
    }
  };
  const KeepAlive = KeepAliveImpl;
  function matches(pattern, name) {
    if (isArray(pattern)) {
      return pattern.some((p) => matches(p, name));
    } else if (isString(pattern)) {
      return pattern.split(",").includes(name);
    } else if (isRegExp(pattern)) {
      pattern.lastIndex = 0;
      return pattern.test(name);
    }
    return false;
  }
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function resetShapeFlag(vnode) {
    vnode.shapeFlag &= -257;
    vnode.shapeFlag &= -513;
  }
  function getInnerChild(vnode) {
    return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
  }

  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else {
      const apiName = toHandlerKey(ErrorTypeStrings$1[type].replace(/ hook$/, ""));
      warn$1(
        `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().` + (` If you are using async setup(), make sure to register lifecycle hooks before the first await statement.` )
      );
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }

  const COMPONENTS = "components";
  const DIRECTIVES = "directives";
  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  }
  function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      if (type === COMPONENTS) {
        const selfName = getComponentName(
          Component,
          false
        );
        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }
      const res = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type] || Component[type], name) || // global registration
        resolve(instance.appContext[type], name)
      );
      if (!res && maybeSelfReference) {
        return Component;
      }
      if (warnMissing && !res) {
        const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
        warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
      }
      return res;
    } else {
      warn$1(
        `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
      );
    }
  }
  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }

  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache && cache[index];
    const sourceIsArray = isArray(source);
    if (sourceIsArray || isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        isReadonlySource = isReadonly(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached && cached[i]
        );
      }
    } else if (typeof source === "number") {
      if (!Number.isInteger(source)) {
        warn$1(`The v-for range expect an integer value but got ${source}.`);
      }
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached && cached[i])
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached && cached[i]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index] = ret;
    }
    return ret;
  }

  function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
      const slot = dynamicSlots[i];
      if (isArray(slot)) {
        for (let j = 0; j < slot.length; j++) {
          slots[slot[j].name] = slot[j].fn;
        }
      } else if (slot) {
        slots[slot.name] = slot.key ? (...args) => {
          const res = slot.fn(...args);
          if (res) res.key = slot.key;
          return res;
        } : slot.fn;
      }
    }
    return slots;
  }

  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
      const hasProps = Object.keys(props).length > 0;
      if (name !== "default") props.name = name;
      return openBlock(), createBlock(
        Fragment,
        null,
        [createVNode("slot", props, fallback && fallback())],
        hasProps ? -2 : 64
      );
    }
    let slot = slots[name];
    if (slot && slot.length > 1) {
      warn$1(
        `SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template.`
      );
      slot = () => [];
    }
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
    // key attached in the `createSlots` helper, respect that
    validSlotContent && validSlotContent.key;
    const rendered = createBlock(
      Fragment,
      {
        key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
        (!validSlotContent && fallback ? "_fb" : "")
      },
      validSlotContent || (fallback ? fallback() : []),
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }

  function toHandlers(obj, preserveCaseIfNecessary) {
    const ret = {};
    if (!isObject(obj)) {
      warn$1(`v-on with no argument expects an object value.`);
      return ret;
    }
    for (const key in obj) {
      ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
    }
    return ret;
  }

  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => shallowReadonly(i.props) ,
      $attrs: (i) => shallowReadonly(i.attrs) ,
      $slots: (i) => shallowReadonly(i.slots) ,
      $refs: (i) => shallowReadonly(i.refs) ,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i) ,
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i) 
    })
  );
  const isReservedPrefix = (key) => key === "_" || key === "$";
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key === "__isVue") {
        return true;
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1 /* SETUP */:
              return setupState[key];
            case 2 /* DATA */:
              return data[key];
            case 4 /* CONTEXT */:
              return ctx[key];
            case 3 /* PROPS */:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1 /* SETUP */;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2 /* DATA */;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3 /* PROPS */;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4 /* CONTEXT */;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0 /* OTHER */;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
          markAttrsAccessed();
        } else if (key === "$slots") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4 /* CONTEXT */;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf("__v") !== 0)) {
        if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
          warn$1(
            `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
          );
        } else if (instance === currentRenderingInstance) {
          warn$1(
            `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
          );
        }
      }
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
        warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
        return false;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        warn$1(
          `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
        );
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions, type }
    }, key) {
      let normalizedProps, cssModules;
      return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn$1(
        `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
      );
      return Reflect.ownKeys(target);
    };
  }
  const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend({}, PublicInstanceProxyHandlers, {
    get(target, key) {
      if (key === Symbol.unscopables) {
        return;
      }
      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
      const has = key[0] !== "_" && !isGloballyAllowed(key);
      if (!has && PublicInstanceProxyHandlers.has(_, key)) {
        warn$1(
          `Property ${JSON.stringify(
          key
        )} should not start with _ which is a reserved prefix for Vue internals.`
        );
      }
      return has;
    }
  });
  function createDevRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const {
      ctx,
      propsOptions: [propsOptions]
    } = instance;
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      if (!setupState.__isScriptSetup) {
        if (isReservedPrefix(key[0])) {
          warn$1(
            `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
          );
          return;
        }
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => setupState[key],
          set: NOOP
        });
      }
    });
  }

  const warnRuntimeUsage = (method) => warn$1(
    `${method}() is a compiler-hint helper that is only usable inside <script setup> of a single file component. Its arguments should be compiled away and passing it at runtime has no effect.`
  );
  function defineProps() {
    {
      warnRuntimeUsage(`defineProps`);
    }
    return null;
  }
  function defineEmits() {
    {
      warnRuntimeUsage(`defineEmits`);
    }
    return null;
  }
  function defineExpose(exposed) {
    {
      warnRuntimeUsage(`defineExpose`);
    }
  }
  function defineOptions(options) {
    {
      warnRuntimeUsage(`defineOptions`);
    }
  }
  function defineSlots() {
    {
      warnRuntimeUsage(`defineSlots`);
    }
    return null;
  }
  function defineModel() {
    {
      warnRuntimeUsage("defineModel");
    }
  }
  function withDefaults(props, defaults) {
    {
      warnRuntimeUsage(`withDefaults`);
    }
    return null;
  }
  function useSlots() {
    return getContext("useSlots").slots;
  }
  function useAttrs() {
    return getContext("useAttrs").attrs;
  }
  function getContext(calledFunctionName) {
    const i = getCurrentInstance();
    if (!i) {
      warn$1(`${calledFunctionName}() called without active instance.`);
    }
    return i.setupContext || (i.setupContext = createSetupContext(i));
  }
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p) => (normalized[p] = null, normalized),
      {}
    ) : props;
  }
  function mergeDefaults(raw, defaults) {
    const props = normalizePropsOrEmits(raw);
    for (const key in defaults) {
      if (key.startsWith("__skip")) continue;
      let opt = props[key];
      if (opt) {
        if (isArray(opt) || isFunction(opt)) {
          opt = props[key] = { type: opt, default: defaults[key] };
        } else {
          opt.default = defaults[key];
        }
      } else if (opt === null) {
        opt = props[key] = { default: defaults[key] };
      } else {
        warn$1(`props default key "${key}" has no corresponding declaration.`);
      }
      if (opt && defaults[`__skip_${key}`]) {
        opt.skipFactory = true;
      }
    }
    return props;
  }
  function mergeModels(a, b) {
    if (!a || !b) return a || b;
    if (isArray(a) && isArray(b)) return a.concat(b);
    return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
  }
  function createPropsRestProxy(props, excludedKeys) {
    const ret = {};
    for (const key in props) {
      if (!excludedKeys.includes(key)) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          get: () => props[key]
        });
      }
    }
    return ret;
  }
  function withAsyncContext(getAwaitable) {
    const ctx = getCurrentInstance();
    if (!ctx) {
      warn$1(
        `withAsyncContext called without active current instance. This is likely a bug.`
      );
    }
    let awaitable = getAwaitable();
    unsetCurrentInstance();
    if (isPromise(awaitable)) {
      awaitable = awaitable.catch((e) => {
        setCurrentInstance(ctx);
        throw e;
      });
    }
    return [awaitable, () => setCurrentInstance(ctx)];
  }

  function createDuplicateChecker() {
    const cache = /* @__PURE__ */ Object.create(null);
    return (type, key) => {
      if (cache[key]) {
        warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
      } else {
        cache[key] = type;
      }
    };
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook$1(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = createDuplicateChecker() ;
    {
      const [propsOptions] = instance.propsOptions;
      if (propsOptions) {
        for (const key in propsOptions) {
          checkDuplicateProperties("Props" /* PROPS */, key);
        }
      }
    }
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            Object.defineProperty(ctx, key, {
              value: methodHandler.bind(publicThis),
              configurable: true,
              enumerable: true,
              writable: true
            });
          }
          {
            checkDuplicateProperties("Methods" /* METHODS */, key);
          }
        } else {
          warn$1(
            `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
          );
        }
      }
    }
    if (dataOptions) {
      if (!isFunction(dataOptions)) {
        warn$1(
          `The data option must be a function. Plain object usage is no longer supported.`
        );
      }
      const data = dataOptions.call(publicThis, publicThis);
      if (isPromise(data)) {
        warn$1(
          `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
        );
      }
      if (!isObject(data)) {
        warn$1(`data() should return an object.`);
      } else {
        instance.data = reactive(data);
        {
          for (const key in data) {
            checkDuplicateProperties("Data" /* DATA */, key);
            if (!isReservedPrefix(key[0])) {
              Object.defineProperty(ctx, key, {
                configurable: true,
                enumerable: true,
                get: () => data[key],
                set: NOOP
              });
            }
          }
        }
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        if (get === NOOP) {
          warn$1(`Computed property "${key}" has no getter.`);
        }
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
          warn$1(
            `Write operation failed: computed property "${key}" is readonly.`
          );
        } ;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
        {
          checkDuplicateProperties("Computed" /* COMPUTED */, key);
        }
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook$1(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val,
            enumerable: true
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
      {
        checkDuplicateProperties("Inject" /* INJECT */, key);
      }
    }
  }
  function callHook$1(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      } else {
        warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        } else {
          warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
        }
      }
    } else {
      warn$1(`Invalid watch option: "${key}"`, raw);
    }
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") {
        warn$1(
          `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
        );
      } else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return (extend)(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }

  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        warn$1(`root props passed to app.mount() must be an object.`);
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
          {
            warn$1(
              `app.config cannot be replaced. Modify individual options instead.`
            );
          }
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) {
            warn$1(`Plugin has already been applied to target app.`);
          } else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else {
            warn$1(
              `A plugin must either be a function or an object with an "install" function.`
            );
          }
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            } else {
              warn$1(
                "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
              );
            }
          }
          return app;
        },
        component(name, component) {
          {
            validateComponentName(name, context.config);
          }
          if (!component) {
            return context.components[name];
          }
          if (context.components[name]) {
            warn$1(`Component "${name}" has already been registered in target app.`);
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          {
            validateDirectiveName(name);
          }
          if (!directive) {
            return context.directives[name];
          }
          if (context.directives[name]) {
            warn$1(`Directive "${name}" has already been registered in target app.`);
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            if (rootContainer.__vue_app__) {
              warn$1(
                `There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`
              );
            }
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              context.reload = () => {
                const cloned = cloneVNode(vnode);
                cloned.el = null;
                render(cloned, rootContainer, namespace);
              };
            }
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }
            return getComponentPublicInstance(vnode.component);
          } else {
            warn$1(
              `App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``
            );
          }
        },
        onUnmount(cleanupFn) {
          if (typeof cleanupFn !== "function") {
            warn$1(
              `Expected function as first argument to app.onUnmount(), but got ${typeof cleanupFn}`
            );
          }
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render(null, app._container);
            {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          } else {
            warn$1(`Cannot unmount an app that is not mounted.`);
          }
        },
        provide(key, value) {
          if (key in context.provides) {
            if (hasOwn(context.provides, key)) {
              warn$1(
                `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
              );
            } else {
              warn$1(
                `App already provides property with key "${String(key)}" inherited from its parent element. It will be overwritten with the new value.`
              );
            }
          }
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;

  function provide(key, value) {
    if (!currentInstance) {
      {
        warn$1(`provide() can only be used inside setup().`);
      }
    } else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else {
        warn$1(`injection "${String(key)}" not found.`);
      }
    } else {
      warn$1(`inject() can only be used inside setup() or functional components.`);
    }
  }
  function hasInjectionContext() {
    return !!(getCurrentInstance() || currentApp);
  }

  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;

  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function isInHmrContext(instance) {
    while (instance) {
      if (instance.type.__hmrId) return true;
      instance = instance.parent;
    }
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      !isInHmrContext(instance) && (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[0 /* shouldCast */]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[1 /* shouldCastTrue */] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (!isString(raw[i])) {
          warn$1(`props must be strings when using array syntax.`, raw[i]);
        }
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      if (!isObject(raw)) {
        warn$1(`invalid props options`, raw);
      }
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[0 /* shouldCast */] = shouldCast;
          prop[1 /* shouldCastTrue */] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    } else {
      warn$1(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
  }
  function getType(ctor) {
    if (ctor === null) {
      return "null";
    }
    if (typeof ctor === "function") {
      return ctor.name || "";
    } else if (typeof ctor === "object") {
      const name = ctor.constructor && ctor.constructor.name;
      return name || "";
    }
    return "";
  }
  function validateProps(rawProps, props, instance) {
    const resolvedValues = toRaw(props);
    const options = instance.propsOptions[0];
    const camelizePropsKey = Object.keys(rawProps).map((key) => camelize(key));
    for (const key in options) {
      let opt = options[key];
      if (opt == null) continue;
      validateProp(
        key,
        resolvedValues[key],
        opt,
        shallowReadonly(resolvedValues) ,
        !camelizePropsKey.includes(key)
      );
    }
  }
  function validateProp(name, value, prop, props, isAbsent) {
    const { type, required, validator, skipCheck } = prop;
    if (required && isAbsent) {
      warn$1('Missing required prop: "' + name + '"');
      return;
    }
    if (value == null && !required) {
      return;
    }
    if (type != null && type !== true && !skipCheck) {
      let isValid = false;
      const types = isArray(type) ? type : [type];
      const expectedTypes = [];
      for (let i = 0; i < types.length && !isValid; i++) {
        const { valid, expectedType } = assertType(value, types[i]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn$1(getInvalidTypeMessage(name, value, expectedTypes));
        return;
      }
    }
    if (validator && !validator(value, props)) {
      warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
    }
  }
  const isSimpleType = /* @__PURE__ */ makeMap(
    "String,Number,Boolean,Function,Symbol,BigInt"
  );
  function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (expectedType === "null") {
      valid = value === null;
    } else if (isSimpleType(expectedType)) {
      const t = typeof value;
      valid = t === expectedType.toLowerCase();
      if (!valid && t === "object") {
        valid = value instanceof type;
      }
    } else if (expectedType === "Object") {
      valid = isObject(value);
    } else if (expectedType === "Array") {
      valid = isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
    if (expectedTypes.length === 0) {
      return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
    }
    let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type) {
    if (type === "String") {
      return `"${value}"`;
    } else if (type === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type.toLowerCase() === elem);
  }
  function isBoolean(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }

  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (currentInstance && !(ctx === null && currentRenderingInstance) && !(ctx && ctx.root !== currentInstance.root)) {
        warn$1(
          `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
        );
      }
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        {
          warn$1(
            `Non-function value encountered for slot "${key}". Prefer function slots for better performance.`
          );
        }
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if (!isKeepAlive(instance.vnode) && true) {
      warn$1(
        `Non-function value encountered for default slot. Prefer function slots for better performance.`
      );
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (isHmrUpdating) {
          assignSlots(slots, children, optimized);
          trigger(instance, "set", "$slots");
        } else if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };

  let supported;
  let perf;
  function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      perf.mark(`vue-${type}-${instance.uid}`);
    }
    {
      devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
    }
  }
  function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      const startTag = `vue-${type}-${instance.uid}`;
      const endTag = startTag + `:end`;
      const measureName = `<${formatComponentName(instance, instance.type)}> ${type}`;
      perf.mark(endTag);
      perf.measure(measureName, startTag, endTag);
      perf.clearMeasures(measureName);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    }
    {
      devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
    }
  }
  function isSupported() {
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else {
      supported = false;
    }
    return supported;
  }

  const queuePostRenderEffect = queueEffectWithSuspense ;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    {
      setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          } else {
            patchStaticNode(n1, n2, container, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else {
            warn$1("Invalid VNode type:", type, `(${typeof type})`);
          }
      }
      if (ref != null && parentComponent) {
        setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const patchStaticNode = (n1, n2, container, namespace) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          namespace
        );
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      {
        def(el, "__vnode", vnode, true);
        def(el, "__vueParentComponent", parentComponent, true);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
          subTree = filterSingleRoot(subTree.children) || subTree;
        }
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      {
        el.__vnode = n2;
      }
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
        {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (
        // #5523 dev root fragment may inherit directives
        isHmrUpdating || patchFlag & 2048
      ) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          {
            traverseStaticChildren(n1, n2);
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = (initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      ));
      if (instance.type.__hmrId) {
        registerHMR(instance);
      }
      {
        pushWarningContext(initialVNode);
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        {
          startMeasure(instance, `init`);
        }
        setupComponent(instance, false, optimized);
        {
          endMeasure(instance, `init`);
        }
      }
      if (isHmrUpdating) initialVNode.el = null;
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
      {
        popWarningContext();
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          {
            pushWarningContext(n2);
          }
          updateComponentPreRender(instance, n2, optimized);
          {
            popWarningContext();
          }
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              {
                startMeasure(instance, `render`);
              }
              instance.subTree = renderComponentRoot(instance);
              {
                endMeasure(instance, `render`);
              }
              {
                startMeasure(instance, `hydrate`);
              }
              hydrateNode(
                el,
                instance.subTree,
                instance,
                parentSuspense,
                null
              );
              {
                endMeasure(instance, `hydrate`);
              }
            };
            if (isAsyncWrapperVNode && type.__asyncHydrate) {
              type.__asyncHydrate(
                el,
                instance,
                hydrateSubTree
              );
            } else {
              hydrateSubTree();
            }
          } else {
            if (root.ce && // @ts-expect-error _def is private
            root.ce._def.shadowRoot !== false) {
              root.ce._injectChildStyle(type);
            }
            {
              startMeasure(instance, `render`);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            {
              endMeasure(instance, `render`);
            }
            {
              startMeasure(instance, `patch`);
            }
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          {
            devtoolsComponentAdded(instance);
          }
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          {
            pushWarningContext(next || instance.vnode);
          }
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          {
            startMeasure(instance, `patch`);
          }
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
          {
            devtoolsComponentUpdated(instance);
          }
          {
            popWarningContext();
          }
        }
      };
      instance.scope.on();
      const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect.run.bind(effect);
      const job = instance.job = effect.runIfDirty.bind(effect);
      job.i = instance;
      job.id = instance.uid;
      effect.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      {
        effect.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
        effect.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
      }
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            if (keyToNewIndexMap.has(nextChild.key)) {
              warn$1(
                `Duplicate keys found during update:`,
                JSON.stringify(nextChild.key),
                `Make sure keys are unique.`
              );
            }
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, fallback to el placeholder for unresolved async component
            anchorVNode.el || anchorVNode.placeholder
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove2 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove2();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove2, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref != null) {
        pauseTracking();
        setRef(ref, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        if (vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
          vnode.children.forEach((child) => {
            if (child.type === Comment) {
              hostRemove(child.el);
            } else {
              remove(child);
            }
          });
        } else {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if (instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(
        internals
      );
    }
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect, job }, allowed) {
    if (allowed) {
      effect.flags |= 32;
      job.flags |= 4;
    } else {
      effect.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text && // avoid cached text nodes retaining detached dom nodes
        c2.patchFlag !== -1) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
        {
          c2.el && (c2.el.__vnode = c2);
        }
      }
    }
  }
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }

  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      warn$1(`useSSRContext() is not supported in the global build.`);
    }
  };

  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }
  function watchPostEffect(effect, options) {
    return doWatch(
      effect,
      null,
      extend({}, options, { flush: "post" }) 
    );
  }
  function watchSyncEffect(effect, options) {
    return doWatch(
      effect,
      null,
      extend({}, options, { flush: "sync" }) 
    );
  }
  function watch(source, cb, options) {
    if (!isFunction(cb)) {
      warn$1(
        `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
      );
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    if (!cb) {
      if (immediate !== void 0) {
        warn$1(
          `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (deep !== void 0) {
        warn$1(
          `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (once !== void 0) {
        warn$1(
          `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
    }
    const baseWatchOptions = extend({}, options);
    baseWatchOptions.onWarn = warn$1;
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }

  function useModel(props, name, options = EMPTY_OBJ) {
    const i = getCurrentInstance();
    if (!i) {
      warn$1(`useModel() called without active instance.`);
      return ref();
    }
    const camelizedName = camelize(name);
    if (!i.propsOptions[0][camelizedName]) {
      warn$1(`useModel() called with prop "${name}" which is not declared.`);
      return ref();
    }
    const hyphenatedName = hyphenate(name);
    const modifiers = getModelModifiers(props, camelizedName);
    const res = customRef((track, trigger) => {
      let localValue;
      let prevSetValue = EMPTY_OBJ;
      let prevEmittedValue;
      watchSyncEffect(() => {
        const propValue = props[camelizedName];
        if (hasChanged(localValue, propValue)) {
          localValue = propValue;
          trigger();
        }
      });
      return {
        get() {
          track();
          return options.get ? options.get(localValue) : localValue;
        },
        set(value) {
          const emittedValue = options.set ? options.set(value) : value;
          if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) {
            return;
          }
          const rawProps = i.vnode.props;
          if (!(rawProps && // check if parent has passed v-model
          (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
            localValue = value;
            trigger();
          }
          i.emit(`update:${name}`, emittedValue);
          if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) {
            trigger();
          }
          prevSetValue = value;
          prevEmittedValue = emittedValue;
        }
      };
    });
    res[Symbol.iterator] = () => {
      let i2 = 0;
      return {
        next() {
          if (i2 < 2) {
            return { value: i2++ ? modifiers || EMPTY_OBJ : res, done: false };
          } else {
            return { done: true };
          }
        }
      };
    };
    return res;
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };

  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    {
      const {
        emitsOptions,
        propsOptions: [propsOptions]
      } = instance;
      if (emitsOptions) {
        if (!(event in emitsOptions) && true) {
          if (!propsOptions || !(toHandlerKey(camelize(event)) in propsOptions)) {
            warn$1(
              `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(camelize(event))}" prop.`
            );
          }
        } else {
          const validator = emitsOptions[event];
          if (isFunction(validator)) {
            const isValid = validator(...rawArgs);
            if (!isValid) {
              warn$1(
                `Invalid event arguments: event validation failed for event "${event}".`
              );
            }
          }
        }
      }
    }
    let args = rawArgs;
    const isModelListener = event.startsWith("update:");
    const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    {
      devtoolsComponentEmit(instance, event, args);
    }
    {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
        warn$1(
          `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
        );
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }

  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    {
      accessedAttrs = false;
    }
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = setupState.__isScriptSetup ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            true ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (attrs === props) {
          markAttrsAccessed();
        }
        result = normalizeVNode(
          render2.length > 1 ? render2(
            true ? shallowReadonly(props) : props,
            true ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit
            } : { attrs, slots, emit }
          ) : render2(
            true ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    let setRoot = void 0;
    if (result.patchFlag > 0 && result.patchFlag & 2048) {
      [root, setRoot] = getChildRoot(result);
    }
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        } else if (!accessedAttrs && root.type !== Comment) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          const extraAttrs = [];
          for (let i = 0, l = allAttrs.length; i < l; i++) {
            const key = allAttrs[i];
            if (isOn(key)) {
              if (!isModelListener(key)) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            } else {
              extraAttrs.push(key);
            }
          }
          if (extraAttrs.length) {
            warn$1(
              `Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
            );
          }
          if (eventAttrs.length) {
            warn$1(
              `Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
            );
          }
        }
      }
    }
    if (vnode.dirs) {
      if (!isElementRoot(root)) {
        warn$1(
          `Runtime directive used on component with non-element root node. The directives will not function as intended.`
        );
      }
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if (!isElementRoot(root)) {
        warn$1(
          `Component inside <Transition> renders non-element root node that cannot be animated.`
        );
      }
      setTransitionHooks(root, vnode.transition);
    }
    if (setRoot) {
      setRoot(root);
    } else {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getChildRoot = (vnode) => {
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const childRoot = filterSingleRoot(rawChildren, false);
    if (!childRoot) {
      return [vnode, void 0];
    } else if (childRoot.patchFlag > 0 && childRoot.patchFlag & 2048) {
      return getChildRoot(childRoot);
    }
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicChildren) {
        if (dynamicIndex > -1) {
          dynamicChildren[dynamicIndex] = updatedRoot;
        } else if (updatedRoot.patchFlag > 0) {
          vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
        }
      }
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  function filterSingleRoot(children, recurse = true) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
            if (recurse && singleRoot.patchFlag > 0 && singleRoot.patchFlag & 2048) {
              return filterSingleRoot(singleRoot.children);
            }
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if ((prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }

  const isSuspense = (type) => type.__isSuspense;
  let suspenseId = 0;
  const SuspenseImpl = {
    name: "Suspense",
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
      if (n1 == null) {
        mountSuspense(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      } else {
        if (parentSuspense && parentSuspense.deps > 0 && !n1.suspense.isInFallback) {
          n2.suspense = n1.suspense;
          n2.suspense.vnode = n2;
          n2.el = n1.el;
          return;
        }
        patchSuspense(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          namespace,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      }
    },
    hydrate: hydrateSuspense,
    normalize: normalizeSuspenseChildren
  };
  const Suspense = SuspenseImpl ;
  function triggerEvent(vnode, name) {
    const eventListener = vnode.props && vnode.props[name];
    if (isFunction(eventListener)) {
      eventListener();
    }
  }
  function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
    const {
      p: patch,
      o: { createElement }
    } = rendererInternals;
    const hiddenContainer = createElement("div");
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      container,
      hiddenContainer,
      anchor,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals
    );
    patch(
      null,
      suspense.pendingBranch = vnode.ssContent,
      hiddenContainer,
      null,
      parentComponent,
      suspense,
      namespace,
      slotScopeIds
    );
    if (suspense.deps > 0) {
      triggerEvent(vnode, "onPending");
      triggerEvent(vnode, "onFallback");
      patch(
        null,
        vnode.ssFallback,
        container,
        anchor,
        parentComponent,
        null,
        // fallback tree will not have suspense context
        namespace,
        slotScopeIds
      );
      setActiveBranch(suspense, vnode.ssFallback);
    } else {
      suspense.resolve(false, true);
    }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
    const suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    n2.el = n1.el;
    const newBranch = n2.ssContent;
    const newFallback = n2.ssFallback;
    const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
    if (pendingBranch) {
      suspense.pendingBranch = newBranch;
      if (isSameVNodeType(pendingBranch, newBranch)) {
        patch(
          pendingBranch,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else if (isInFallback) {
          if (!isHydrating) {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        }
      } else {
        suspense.pendingId = suspenseId++;
        if (isHydrating) {
          suspense.isHydrating = false;
          suspense.activeBranch = pendingBranch;
        } else {
          unmount(pendingBranch, parentComponent, suspense);
        }
        suspense.deps = 0;
        suspense.effects.length = 0;
        suspense.hiddenContainer = createElement("div");
        if (isInFallback) {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          } else {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              namespace,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        } else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
          patch(
            activeBranch,
            newBranch,
            container,
            anchor,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          suspense.resolve(true);
        } else {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            namespace,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          }
        }
      }
    } else {
      if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newBranch);
      } else {
        triggerEvent(n2, "onPending");
        suspense.pendingBranch = newBranch;
        if (newBranch.shapeFlag & 512) {
          suspense.pendingId = newBranch.component.suspenseId;
        } else {
          suspense.pendingId = suspenseId++;
        }
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          namespace,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          const { timeout, pendingId } = suspense;
          if (timeout > 0) {
            setTimeout(() => {
              if (suspense.pendingId === pendingId) {
                suspense.fallback(newFallback);
              }
            }, timeout);
          } else if (timeout === 0) {
            suspense.fallback(newFallback);
          }
        }
      }
    }
  }
  let hasWarned = false;
  function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
    if (!hasWarned) {
      hasWarned = true;
      console[console.info ? "info" : "log"](
        `<Suspense> is an experimental feature and its API will likely change.`
      );
    }
    const {
      p: patch,
      m: move,
      um: unmount,
      n: next,
      o: { parentNode, remove }
    } = rendererInternals;
    let parentSuspenseId;
    const isSuspensible = isVNodeSuspensible(vnode);
    if (isSuspensible) {
      if (parentSuspense && parentSuspense.pendingBranch) {
        parentSuspenseId = parentSuspense.pendingId;
        parentSuspense.deps++;
      }
    }
    const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
    {
      assertNumber(timeout, `Suspense timeout`);
    }
    const initialAnchor = anchor;
    const suspense = {
      vnode,
      parent: parentSuspense,
      parentComponent,
      namespace,
      container,
      hiddenContainer,
      deps: 0,
      pendingId: suspenseId++,
      timeout: typeof timeout === "number" ? timeout : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: !isHydrating,
      isHydrating,
      isUnmounted: false,
      effects: [],
      resolve(resume = false, sync = false) {
        {
          if (!resume && !suspense.pendingBranch) {
            throw new Error(
              `suspense.resolve() is called without a pending branch.`
            );
          }
          if (suspense.isUnmounted) {
            throw new Error(
              `suspense.resolve() is called on an already unmounted suspense boundary.`
            );
          }
        }
        const {
          vnode: vnode2,
          activeBranch,
          pendingBranch,
          pendingId,
          effects,
          parentComponent: parentComponent2,
          container: container2
        } = suspense;
        let delayEnter = false;
        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else if (!resume) {
          delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
          if (delayEnter) {
            activeBranch.transition.afterLeave = () => {
              if (pendingId === suspense.pendingId) {
                move(
                  pendingBranch,
                  container2,
                  anchor === initialAnchor ? next(activeBranch) : anchor,
                  0
                );
                queuePostFlushCb(effects);
              }
            };
          }
          if (activeBranch) {
            if (parentNode(activeBranch.el) === container2) {
              anchor = next(activeBranch);
            }
            unmount(activeBranch, parentComponent2, suspense, true);
          }
          if (!delayEnter) {
            move(pendingBranch, container2, anchor, 0);
          }
        }
        setActiveBranch(suspense, pendingBranch);
        suspense.pendingBranch = null;
        suspense.isInFallback = false;
        let parent = suspense.parent;
        let hasUnresolvedAncestor = false;
        while (parent) {
          if (parent.pendingBranch) {
            parent.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }
          parent = parent.parent;
        }
        if (!hasUnresolvedAncestor && !delayEnter) {
          queuePostFlushCb(effects);
        }
        suspense.effects = [];
        if (isSuspensible) {
          if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0 && !sync) {
              parentSuspense.resolve();
            }
          }
        }
        triggerEvent(vnode2, "onResolve");
      },
      fallback(fallbackVNode) {
        if (!suspense.pendingBranch) {
          return;
        }
        const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
        triggerEvent(vnode2, "onFallback");
        const anchor2 = next(activeBranch);
        const mountFallback = () => {
          if (!suspense.isInFallback) {
            return;
          }
          patch(
            null,
            fallbackVNode,
            container2,
            anchor2,
            parentComponent2,
            null,
            // fallback tree will not have suspense context
            namespace2,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, fallbackVNode);
        };
        const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = mountFallback;
        }
        suspense.isInFallback = true;
        unmount(
          activeBranch,
          parentComponent2,
          null,
          // no suspense so unmount hooks fire now
          true
          // shouldRemove
        );
        if (!delayEnter) {
          mountFallback();
        }
      },
      move(container2, anchor2, type) {
        suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
        suspense.container = container2;
      },
      next() {
        return suspense.activeBranch && next(suspense.activeBranch);
      },
      registerDep(instance, setupRenderEffect, optimized2) {
        const isInPendingSuspense = !!suspense.pendingBranch;
        if (isInPendingSuspense) {
          suspense.deps++;
        }
        const hydratedEl = instance.vnode.el;
        instance.asyncDep.catch((err) => {
          handleError(err, instance, 0);
        }).then((asyncSetupResult) => {
          if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
            return;
          }
          instance.asyncResolved = true;
          const { vnode: vnode2 } = instance;
          {
            pushWarningContext(vnode2);
          }
          handleSetupResult(instance, asyncSetupResult, false);
          if (hydratedEl) {
            vnode2.el = hydratedEl;
          }
          const placeholder = !hydratedEl && instance.subTree.el;
          setupRenderEffect(
            instance,
            vnode2,
            // component may have been moved before resolve.
            // if this is not a hydration, instance.subTree will be the comment
            // placeholder.
            parentNode(hydratedEl || instance.subTree.el),
            // anchor will not be used if this is hydration, so only need to
            // consider the comment placeholder case.
            hydratedEl ? null : next(instance.subTree),
            suspense,
            namespace,
            optimized2
          );
          if (placeholder) {
            remove(placeholder);
          }
          updateHOCHostEl(instance, vnode2.el);
          {
            popWarningContext();
          }
          if (isInPendingSuspense && --suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },
      unmount(parentSuspense2, doRemove) {
        suspense.isUnmounted = true;
        if (suspense.activeBranch) {
          unmount(
            suspense.activeBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
        if (suspense.pendingBranch) {
          unmount(
            suspense.pendingBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
      }
    };
    return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      node.parentNode,
      // eslint-disable-next-line no-restricted-globals
      document.createElement("div"),
      null,
      namespace,
      slotScopeIds,
      optimized,
      rendererInternals,
      true
    );
    const result = hydrateNode(
      node,
      suspense.pendingBranch = vnode.ssContent,
      parentComponent,
      suspense,
      slotScopeIds,
      optimized
    );
    if (suspense.deps === 0) {
      suspense.resolve(false, true);
    }
    return result;
  }
  function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    const isSlotChildren = shapeFlag & 32;
    vnode.ssContent = normalizeSuspenseSlot(
      isSlotChildren ? children.default : children
    );
    vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
  }
  function normalizeSuspenseSlot(s) {
    let block;
    if (isFunction(s)) {
      const trackBlock = isBlockTreeEnabled && s._c;
      if (trackBlock) {
        s._d = false;
        openBlock();
      }
      s = s();
      if (trackBlock) {
        s._d = true;
        block = currentBlock;
        closeBlock();
      }
    }
    if (isArray(s)) {
      const singleChild = filterSingleRoot(s);
      if (!singleChild && s.filter((child) => child !== NULL_DYNAMIC_COMPONENT).length > 0) {
        warn$1(`<Suspense> slots expect a single root node.`);
      }
      s = singleChild;
    }
    s = normalizeVNode(s);
    if (block && !s.dynamicChildren) {
      s.dynamicChildren = block.filter((c) => c !== s);
    }
    return s;
  }
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function setActiveBranch(suspense, branch) {
    suspense.activeBranch = branch;
    const { vnode, parentComponent } = suspense;
    let el = branch.el;
    while (!el && branch.component) {
      branch = branch.component.subTree;
      el = branch.el;
    }
    vnode.el = el;
    if (parentComponent && parentComponent.subTree === vnode) {
      parentComponent.vnode.el = el;
      updateHOCHostEl(parentComponent, el);
    }
  }
  function isVNodeSuspensible(vnode) {
    const suspensible = vnode.props && vnode.props.suspensible;
    return suspensible != null && suspensible !== false;
  }

  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 && n1.component) {
      const dirtyInstances = hmrDirtyComponents.get(n2.type);
      if (dirtyInstances && dirtyInstances.has(n1.component)) {
        n1.shapeFlag &= -257;
        n2.shapeFlag &= -513;
        return false;
      }
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  let vnodeArgsTransformer;
  function transformVNodeArgs(transformer) {
    vnodeArgsTransformer = transformer;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(
      ...vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args
    );
  };
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref,
    ref_key,
    ref_for
  }) => {
    if (typeof ref === "number") {
      ref = "" + ref;
    }
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (vnode.key !== vnode.key) {
      warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = createVNodeWithArgsTransform ;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      if (!type) {
        warn$1(`Invalid vnode type when creating vnode: ${type}.`);
      }
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    if (shapeFlag & 4 && isProxy(type)) {
      type = toRaw(type);
      warn$1(
        `Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`,
        `
Component that was made reactive: `,
        type
      );
    }
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      placeholder: vnode.placeholder,
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray(vnode.children)) {
      cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }

  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = createDevRenderContext(instance);
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    internalSetCurrentInstance = (i) => {
      currentInstance = i;
    };
    setInSSRSetupState = (v) => {
      isInSSRComponentSetup = v;
    };
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name, { isNativeTag }) {
    if (isBuiltInTag(name) || isNativeTag(name)) {
      warn$1(
        "Do not use built-in or reserved HTML elements as component id: " + name
      );
    }
  }
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    var _a;
    const Component = instance.type;
    {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i = 0; i < names.length; i++) {
          validateComponentName(names[i], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i = 0; i < names.length; i++) {
          validateDirectiveName(names[i]);
        }
      }
      if (Component.compilerOptions && isRuntimeOnly()) {
        warn$1(
          `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
        );
      }
    }
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    {
      exposePropsOnRenderContext(instance);
    }
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          shallowReadonly(instance.props) ,
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
          if (!instance.suspense) {
            const name = (_a = Component.name) != null ? _a : "Anonymous";
            warn$1(
              `Component <${name}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
            );
          }
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      if (isVNode(setupResult)) {
        warn$1(
          `setup() should not return VNodes directly - return a render function instead.`
        );
      }
      {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
      {
        exposeSetupStateOnRenderContext(instance);
      }
    } else if (setupResult !== void 0) {
      warn$1(
        `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
      );
    }
    finishComponentSetup(instance, isSSR);
  }
  let compile$1;
  let installWithProxy;
  function registerRuntimeCompiler(_compile) {
    compile$1 = _compile;
    installWithProxy = (i) => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  }
  const isRuntimeOnly = () => !compile$1;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile$1 && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          {
            startMeasure(instance, `compile`);
          }
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(
            extend(
              {
                isCustomElement,
                delimiters
              },
              compilerOptions
            ),
            componentCompilerOptions
          );
          Component.render = compile$1(template, finalCompilerOptions);
          {
            endMeasure(instance, `compile`);
          }
        }
      }
      instance.render = Component.render || NOOP;
      if (installWithProxy) {
        installWithProxy(instance);
      }
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
    if (!Component.render && instance.render === NOOP && !isSSR) {
      if (!compile$1 && Component.template) {
        warn$1(
          `Component provided template option but runtime compilation is not supported in this build of Vue.` + (` Use "vue.global.js" instead.` )
        );
      } else {
        warn$1(`Component is missing template or render function: `, Component);
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      markAttrsAccessed();
      track(target, "get", "");
      return target[key];
    },
    set() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    },
    deleteProperty() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    }
  } ;
  function getSlotsProxy(instance) {
    return new Proxy(instance.slots, {
      get(target, key) {
        track(instance, "get", "$slots");
        return target[key];
      }
    });
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      {
        if (instance.exposed) {
          warn$1(`expose() should be called only once per setup().`);
        }
        if (exposed != null) {
          let exposedType = typeof exposed;
          if (exposedType === "object") {
            if (isArray(exposed)) {
              exposedType = "array";
            } else if (isRef(exposed)) {
              exposedType = "ref";
            }
          }
          if (exposedType !== "object") {
            warn$1(
              `expose() should be passed a plain object, received ${exposedType}.`
            );
          }
        }
      }
      instance.exposed = exposed || {};
    };
    {
      let attrsProxy;
      let slotsProxy;
      return Object.freeze({
        get attrs() {
          return attrsProxy || (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers));
        },
        get slots() {
          return slotsProxy || (slotsProxy = getSlotsProxy(instance));
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        },
        expose
      });
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])\w/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }

  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    {
      const i = getCurrentInstance();
      if (i && i.appContext.config.warnRecursiveComputed) {
        c._warnRecursive = true;
      }
    }
    return c;
  };

  function h(type, propsOrChildren, children) {
    try {
      setBlockTracking(-1);
      const l = arguments.length;
      if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    } finally {
      setBlockTracking(1);
    }
  }

  function initCustomFormatter() {
    if (typeof window === "undefined") {
      return;
    }
    const vueStyle = { style: "color:#3ba776" };
    const numberStyle = { style: "color:#1677ff" };
    const stringStyle = { style: "color:#f5222d" };
    const keywordStyle = { style: "color:#eb2f96" };
    const formatter = {
      __vue_custom_formatter: true,
      header(obj) {
        if (!isObject(obj)) {
          return null;
        }
        if (obj.__isVue) {
          return ["div", vueStyle, `VueInstance`];
        } else if (isRef(obj)) {
          pauseTracking();
          const value = obj.value;
          resetTracking();
          return [
            "div",
            {},
            ["span", vueStyle, genRefFlag(obj)],
            "<",
            formatValue(value),
            `>`
          ];
        } else if (isReactive(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
            "<",
            formatValue(obj),
            `>${isReadonly(obj) ? ` (readonly)` : ``}`
          ];
        } else if (isReadonly(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
            "<",
            formatValue(obj),
            ">"
          ];
        }
        return null;
      },
      hasBody(obj) {
        return obj && obj.__isVue;
      },
      body(obj) {
        if (obj && obj.__isVue) {
          return [
            "div",
            {},
            ...formatInstance(obj.$)
          ];
        }
      }
    };
    function formatInstance(instance) {
      const blocks = [];
      if (instance.type.props && instance.props) {
        blocks.push(createInstanceBlock("props", toRaw(instance.props)));
      }
      if (instance.setupState !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("setup", instance.setupState));
      }
      if (instance.data !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("data", toRaw(instance.data)));
      }
      const computed = extractKeys(instance, "computed");
      if (computed) {
        blocks.push(createInstanceBlock("computed", computed));
      }
      const injected = extractKeys(instance, "inject");
      if (injected) {
        blocks.push(createInstanceBlock("injected", injected));
      }
      blocks.push([
        "div",
        {},
        [
          "span",
          {
            style: keywordStyle.style + ";opacity:0.66"
          },
          "$ (internal): "
        ],
        ["object", { object: instance }]
      ]);
      return blocks;
    }
    function createInstanceBlock(type, target) {
      target = extend({}, target);
      if (!Object.keys(target).length) {
        return ["span", {}];
      }
      return [
        "div",
        { style: "line-height:1.25em;margin-bottom:0.6em" },
        [
          "div",
          {
            style: "color:#476582"
          },
          type
        ],
        [
          "div",
          {
            style: "padding-left:1.25em"
          },
          ...Object.keys(target).map((key) => {
            return [
              "div",
              {},
              ["span", keywordStyle, key + ": "],
              formatValue(target[key], false)
            ];
          })
        ]
      ];
    }
    function formatValue(v, asRaw = true) {
      if (typeof v === "number") {
        return ["span", numberStyle, v];
      } else if (typeof v === "string") {
        return ["span", stringStyle, JSON.stringify(v)];
      } else if (typeof v === "boolean") {
        return ["span", keywordStyle, v];
      } else if (isObject(v)) {
        return ["object", { object: asRaw ? toRaw(v) : v }];
      } else {
        return ["span", stringStyle, String(v)];
      }
    }
    function extractKeys(instance, type) {
      const Comp = instance.type;
      if (isFunction(Comp)) {
        return;
      }
      const extracted = {};
      for (const key in instance.ctx) {
        if (isKeyOfType(Comp, key, type)) {
          extracted[key] = instance.ctx[key];
        }
      }
      return extracted;
    }
    function isKeyOfType(Comp, key, type) {
      const opts = Comp[type];
      if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
        return true;
      }
      if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
        return true;
      }
      if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) {
        return true;
      }
    }
    function genRefFlag(v) {
      if (isShallow(v)) {
        return `ShallowRef`;
      }
      if (v.effect) {
        return `ComputedRef`;
      }
      return `Ref`;
    }
    if (window.devtoolsFormatters) {
      window.devtoolsFormatters.push(formatter);
    } else {
      window.devtoolsFormatters = [formatter];
    }
  }

  function withMemo(memo, render, cache, index) {
    const cached = cache[index];
    if (cached && isMemoSame(cached, memo)) {
      return cached;
    }
    const ret = render();
    ret.memo = memo.slice();
    ret.cacheIndex = index;
    return cache[index] = ret;
  }
  function isMemoSame(cached, memo) {
    const prev = cached.memo;
    if (prev.length != memo.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (hasChanged(prev[i], memo[i])) {
        return false;
      }
    }
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(cached);
    }
    return true;
  }

  const version = "3.5.22";
  const warn = warn$1 ;
  const ErrorTypeStrings = ErrorTypeStrings$1 ;
  const devtools = devtools$1 ;
  const setDevtoolsHook = setDevtoolsHook$1 ;
  const ssrUtils = null;
  const resolveFilter = null;
  const compatUtils = null;
  const DeprecationTypes = null;

  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
      warn(`Error creating trusted types policy: ${e}`);
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };

  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = Symbol("_vtc");
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const decorate$1 = (t) => {
    t.displayName = "Transition";
    t.props = TransitionPropsValidators;
    return t;
  };
  const Transition = /* @__PURE__ */ decorate$1(
    (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done, isCancelled) => {
      el._enterCancelled = isCancelled;
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        if (!el._enterCancelled) {
          forceReflow(el);
          addTransitionClass(el, leaveActiveClass);
        } else {
          addTransitionClass(el, leaveActiveClass);
          forceReflow(el);
        }
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        callHook(onLeave, [el, resolve]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false, void 0, true);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true, void 0, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    {
      assertNumber(res, "<transition> explicit duration");
    }
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout != null) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto") return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow(el) {
    const targetDocument = el ? el.ownerDocument : document;
    return targetDocument.body.offsetHeight;
  }

  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }

  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const vShow = {
    // used for prop mismatch check during hydration
    name: "show",
    beforeMount(el, { value }, { transition }) {
      el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue) return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el[vShowOriginalDisplay] : "none";
    el[vShowHidden] = !value;
  }

  const CSS_VAR_TEXT = Symbol("CSS_VAR_TEXT" );
  function useCssVars(getter) {
    const instance = getCurrentInstance();
    if (!instance) {
      warn(`useCssVars is called without current active component instance.`);
      return;
    }
    const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
      Array.from(
        document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
      ).forEach((node) => setVarsOnNode(node, vars));
    };
    {
      instance.getCssVars = () => getter(instance.proxy);
    }
    const setVars = () => {
      const vars = getter(instance.proxy);
      if (instance.ce) {
        setVarsOnNode(instance.ce, vars);
      } else {
        setVarsOnVNode(instance.subTree, vars);
      }
      updateTeleports(vars);
    };
    onBeforeUpdate(() => {
      queuePostFlushCb(setVars);
    });
    onMounted(() => {
      watch(setVars, NOOP, { flush: "post" });
      const ob = new MutationObserver(setVars);
      ob.observe(instance.subTree.el.parentNode, { childList: true });
      onUnmounted(() => ob.disconnect());
    });
  }
  function setVarsOnVNode(vnode, vars) {
    if (vnode.shapeFlag & 128) {
      const suspense = vnode.suspense;
      vnode = suspense.activeBranch;
      if (suspense.pendingBranch && !suspense.isHydrating) {
        suspense.effects.push(() => {
          setVarsOnVNode(suspense.activeBranch, vars);
        });
      }
    }
    while (vnode.component) {
      vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 && vnode.el) {
      setVarsOnNode(vnode.el, vars);
    } else if (vnode.type === Fragment) {
      vnode.children.forEach((c) => setVarsOnVNode(c, vars));
    } else if (vnode.type === Static) {
      let { el, anchor } = vnode;
      while (el) {
        setVarsOnNode(el, vars);
        if (el === anchor) break;
        el = el.nextSibling;
      }
    }
  }
  function setVarsOnNode(el, vars) {
    if (el.nodeType === 1) {
      const style = el.style;
      let cssText = "";
      for (const key in vars) {
        const value = normalizeCssVarValue(vars[key]);
        style.setProperty(`--${key}`, value);
        cssText += `--${key}: ${value};`;
      }
      style[CSS_VAR_TEXT] = cssText;
    }
  }

  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const semicolonRE = /[^\\];\s*$/;
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null) val = "";
      {
        if (semicolonRE.test(val)) {
          warn(
            `Unexpected semicolon at the end of '${name}' style value: '${val}'`
          );
        }
      }
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }

  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }

  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
      if (!needRemove) {
        warn(
          `Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`,
          e
        );
      }
    }
    needRemove && el.removeAttribute(attrName || key);
  }

  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = sanitizeEventValue(nextValue, rawName) ;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          sanitizeEventValue(nextValue, rawName) ,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function sanitizeEventValue(value, propName) {
    if (isFunction(value) || isArray(value)) {
      return value;
    }
    warn(
      `Wrong type passed as event handler to ${propName} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof value}.`
    );
    return NOOP;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }

  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }

  const REMOVAL = {};
  // @__NO_SIDE_EFFECTS__
  function defineCustomElement(options, extraOptions, _createApp) {
    let Comp = defineComponent(options, extraOptions);
    if (isPlainObject(Comp)) Comp = extend({}, Comp, extraOptions);
    class VueCustomElement extends VueElement {
      constructor(initialProps) {
        super(Comp, initialProps, _createApp);
      }
    }
    VueCustomElement.def = Comp;
    return VueCustomElement;
  }
  const defineSSRCustomElement = (/* @__NO_SIDE_EFFECTS__ */ (options, extraOptions) => {
    return /* @__PURE__ */ defineCustomElement(options, extraOptions, createSSRApp);
  });
  const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
  };
  class VueElement extends BaseClass {
    constructor(_def, _props = {}, _createApp = createApp) {
      super();
      this._def = _def;
      this._props = _props;
      this._createApp = _createApp;
      this._isVueCE = true;
      /**
       * @internal
       */
      this._instance = null;
      /**
       * @internal
       */
      this._app = null;
      /**
       * @internal
       */
      this._nonce = this._def.nonce;
      this._connected = false;
      this._resolved = false;
      this._numberProps = null;
      this._styleChildren = /* @__PURE__ */ new WeakSet();
      this._ob = null;
      if (this.shadowRoot && _createApp !== createApp) {
        this._root = this.shadowRoot;
      } else {
        if (this.shadowRoot) {
          warn(
            `Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use \`defineSSRCustomElement\`.`
          );
        }
        if (_def.shadowRoot !== false) {
          this.attachShadow(
            extend({}, _def.shadowRootOptions, {
              mode: "open"
            })
          );
          this._root = this.shadowRoot;
        } else {
          this._root = this;
        }
      }
    }
    connectedCallback() {
      if (!this.isConnected) return;
      if (!this.shadowRoot && !this._resolved) {
        this._parseSlots();
      }
      this._connected = true;
      let parent = this;
      while (parent = parent && (parent.parentNode || parent.host)) {
        if (parent instanceof VueElement) {
          this._parent = parent;
          break;
        }
      }
      if (!this._instance) {
        if (this._resolved) {
          this._mount(this._def);
        } else {
          if (parent && parent._pendingResolve) {
            this._pendingResolve = parent._pendingResolve.then(() => {
              this._pendingResolve = void 0;
              this._resolveDef();
            });
          } else {
            this._resolveDef();
          }
        }
      }
    }
    _setParent(parent = this._parent) {
      if (parent) {
        this._instance.parent = parent._instance;
        this._inheritParentContext(parent);
      }
    }
    _inheritParentContext(parent = this._parent) {
      if (parent && this._app) {
        Object.setPrototypeOf(
          this._app._context.provides,
          parent._instance.provides
        );
      }
    }
    disconnectedCallback() {
      this._connected = false;
      nextTick(() => {
        if (!this._connected) {
          if (this._ob) {
            this._ob.disconnect();
            this._ob = null;
          }
          this._app && this._app.unmount();
          if (this._instance) this._instance.ce = void 0;
          this._app = this._instance = null;
          if (this._teleportTargets) {
            this._teleportTargets.clear();
            this._teleportTargets = void 0;
          }
        }
      });
    }
    _processMutations(mutations) {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }
    /**
     * resolve inner component definition (handle possible async component)
     */
    _resolveDef() {
      if (this._pendingResolve) {
        return;
      }
      for (let i = 0; i < this.attributes.length; i++) {
        this._setAttr(this.attributes[i].name);
      }
      this._ob = new MutationObserver(this._processMutations.bind(this));
      this._ob.observe(this, { attributes: true });
      const resolve = (def, isAsync = false) => {
        this._resolved = true;
        this._pendingResolve = void 0;
        const { props, styles } = def;
        let numberProps;
        if (props && !isArray(props)) {
          for (const key in props) {
            const opt = props[key];
            if (opt === Number || opt && opt.type === Number) {
              if (key in this._props) {
                this._props[key] = toNumber(this._props[key]);
              }
              (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
            }
          }
        }
        this._numberProps = numberProps;
        this._resolveProps(def);
        if (this.shadowRoot) {
          this._applyStyles(styles);
        } else if (styles) {
          warn(
            "Custom element style injection is not supported when using shadowRoot: false"
          );
        }
        this._mount(def);
      };
      const asyncDef = this._def.__asyncLoader;
      if (asyncDef) {
        this._pendingResolve = asyncDef().then((def) => {
          def.configureApp = this._def.configureApp;
          resolve(this._def = def, true);
        });
      } else {
        resolve(this._def);
      }
    }
    _mount(def) {
      if (!def.name) {
        def.name = "VueElement";
      }
      this._app = this._createApp(def);
      this._inheritParentContext();
      if (def.configureApp) {
        def.configureApp(this._app);
      }
      this._app._ceVNode = this._createVNode();
      this._app.mount(this._root);
      const exposed = this._instance && this._instance.exposed;
      if (!exposed) return;
      for (const key in exposed) {
        if (!hasOwn(this, key)) {
          Object.defineProperty(this, key, {
            // unwrap ref to be consistent with public instance behavior
            get: () => unref(exposed[key])
          });
        } else {
          warn(`Exposed property "${key}" already exists on custom element.`);
        }
      }
    }
    _resolveProps(def) {
      const { props } = def;
      const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
      for (const key of Object.keys(this)) {
        if (key[0] !== "_" && declaredPropKeys.includes(key)) {
          this._setProp(key, this[key]);
        }
      }
      for (const key of declaredPropKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val, true, true);
          }
        });
      }
    }
    _setAttr(key) {
      if (key.startsWith("data-v-")) return;
      const has = this.hasAttribute(key);
      let value = has ? this.getAttribute(key) : REMOVAL;
      const camelKey = camelize(key);
      if (has && this._numberProps && this._numberProps[camelKey]) {
        value = toNumber(value);
      }
      this._setProp(camelKey, value, false, true);
    }
    /**
     * @internal
     */
    _getProp(key) {
      return this._props[key];
    }
    /**
     * @internal
     */
    _setProp(key, val, shouldReflect = true, shouldUpdate = false) {
      if (val !== this._props[key]) {
        if (val === REMOVAL) {
          delete this._props[key];
        } else {
          this._props[key] = val;
          if (key === "key" && this._app) {
            this._app._ceVNode.key = val;
          }
        }
        if (shouldUpdate && this._instance) {
          this._update();
        }
        if (shouldReflect) {
          const ob = this._ob;
          if (ob) {
            this._processMutations(ob.takeRecords());
            ob.disconnect();
          }
          if (val === true) {
            this.setAttribute(hyphenate(key), "");
          } else if (typeof val === "string" || typeof val === "number") {
            this.setAttribute(hyphenate(key), val + "");
          } else if (!val) {
            this.removeAttribute(hyphenate(key));
          }
          ob && ob.observe(this, { attributes: true });
        }
      }
    }
    _update() {
      const vnode = this._createVNode();
      if (this._app) vnode.appContext = this._app._context;
      render(vnode, this._root);
    }
    _createVNode() {
      const baseProps = {};
      if (!this.shadowRoot) {
        baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
      }
      const vnode = createVNode(this._def, extend(baseProps, this._props));
      if (!this._instance) {
        vnode.ce = (instance) => {
          this._instance = instance;
          instance.ce = this;
          instance.isCE = true;
          {
            instance.ceReload = (newStyles) => {
              if (this._styles) {
                this._styles.forEach((s) => this._root.removeChild(s));
                this._styles.length = 0;
              }
              this._applyStyles(newStyles);
              this._instance = null;
              this._update();
            };
          }
          const dispatch = (event, args) => {
            this.dispatchEvent(
              new CustomEvent(
                event,
                isPlainObject(args[0]) ? extend({ detail: args }, args[0]) : { detail: args }
              )
            );
          };
          instance.emit = (event, ...args) => {
            dispatch(event, args);
            if (hyphenate(event) !== event) {
              dispatch(hyphenate(event), args);
            }
          };
          this._setParent();
        };
      }
      return vnode;
    }
    _applyStyles(styles, owner) {
      if (!styles) return;
      if (owner) {
        if (owner === this._def || this._styleChildren.has(owner)) {
          return;
        }
        this._styleChildren.add(owner);
      }
      const nonce = this._nonce;
      for (let i = styles.length - 1; i >= 0; i--) {
        const s = document.createElement("style");
        if (nonce) s.setAttribute("nonce", nonce);
        s.textContent = styles[i];
        this.shadowRoot.prepend(s);
        {
          if (owner) {
            if (owner.__hmrId) {
              if (!this._childStyles) this._childStyles = /* @__PURE__ */ new Map();
              let entry = this._childStyles.get(owner.__hmrId);
              if (!entry) {
                this._childStyles.set(owner.__hmrId, entry = []);
              }
              entry.push(s);
            }
          } else {
            (this._styles || (this._styles = [])).push(s);
          }
        }
      }
    }
    /**
     * Only called when shadowRoot is false
     */
    _parseSlots() {
      const slots = this._slots = {};
      let n;
      while (n = this.firstChild) {
        const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
        (slots[slotName] || (slots[slotName] = [])).push(n);
        this.removeChild(n);
      }
    }
    /**
     * Only called when shadowRoot is false
     */
    _renderSlots() {
      const outlets = this._getSlots();
      const scopeId = this._instance.type.__scopeId;
      for (let i = 0; i < outlets.length; i++) {
        const o = outlets[i];
        const slotName = o.getAttribute("name") || "default";
        const content = this._slots[slotName];
        const parent = o.parentNode;
        if (content) {
          for (const n of content) {
            if (scopeId && n.nodeType === 1) {
              const id = scopeId + "-s";
              const walker = document.createTreeWalker(n, 1);
              n.setAttribute(id, "");
              let child;
              while (child = walker.nextNode()) {
                child.setAttribute(id, "");
              }
            }
            parent.insertBefore(n, o);
          }
        } else {
          while (o.firstChild) parent.insertBefore(o.firstChild, o);
        }
        parent.removeChild(o);
      }
    }
    /**
     * @internal
     */
    _getSlots() {
      const roots = [this];
      if (this._teleportTargets) {
        roots.push(...this._teleportTargets);
      }
      return roots.reduce((res, i) => {
        res.push(...Array.from(i.querySelectorAll("slot")));
        return res;
      }, []);
    }
    /**
     * @internal
     */
    _injectChildStyle(comp) {
      this._applyStyles(comp.styles, comp);
    }
    /**
     * @internal
     */
    _removeChildStyle(comp) {
      {
        this._styleChildren.delete(comp);
        if (this._childStyles && comp.__hmrId) {
          const oldStyles = this._childStyles.get(comp.__hmrId);
          if (oldStyles) {
            oldStyles.forEach((s) => this._root.removeChild(s));
            oldStyles.length = 0;
          }
        }
      }
    }
  }
  function useHost(caller) {
    const instance = getCurrentInstance();
    const el = instance && instance.ce;
    if (el) {
      return el;
    } else {
      if (!instance) {
        warn(
          `${caller || "useHost"} called without an active component instance.`
        );
      } else {
        warn(
          `${caller || "useHost"} can only be used in components defined via defineCustomElement.`
        );
      }
    }
    return null;
  }
  function useShadowRoot() {
    const el = useHost("useShadowRoot") ;
    return el && el.shadowRoot;
  }

  function useCssModule(name = "$style") {
    {
      {
        warn(`useCssModule() is not supported in the global build.`);
      }
      return EMPTY_OBJ;
    }
  }

  const positionMap = /* @__PURE__ */ new WeakMap();
  const newPositionMap = /* @__PURE__ */ new WeakMap();
  const moveCbKey = Symbol("_moveCb");
  const enterCbKey = Symbol("_enterCb");
  const decorate = (t) => {
    delete t.props.mode;
    return t;
  };
  const TransitionGroupImpl = /* @__PURE__ */ decorate({
    name: "TransitionGroup",
    props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevChildren;
      let children;
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        if (!hasCSSTransform(
          prevChildren[0].el,
          instance.vnode.el,
          moveClass
        )) {
          prevChildren = [];
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach(recordPosition);
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow(instance.vnode.el);
        movedChildren.forEach((c) => {
          const el = c.el;
          const style = el.style;
          addTransitionClass(el, moveClass);
          style.transform = style.webkitTransform = style.transitionDuration = "";
          const cb = el[moveCbKey] = (e) => {
            if (e && e.target !== el) {
              return;
            }
            if (!e || e.propertyName.endsWith("transform")) {
              el.removeEventListener("transitionend", cb);
              el[moveCbKey] = null;
              removeTransitionClass(el, moveClass);
            }
          };
          el.addEventListener("transitionend", cb);
        });
        prevChildren = [];
      });
      return () => {
        const rawProps = toRaw(props);
        const cssTransitionProps = resolveTransitionProps(rawProps);
        let tag = rawProps.tag || Fragment;
        prevChildren = [];
        if (children) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.el && child.el instanceof Element) {
              prevChildren.push(child);
              setTransitionHooks(
                child,
                resolveTransitionHooks(
                  child,
                  cssTransitionProps,
                  state,
                  instance
                )
              );
              positionMap.set(
                child,
                child.el.getBoundingClientRect()
              );
            }
          }
        }
        children = slots.default ? getTransitionRawChildren(slots.default()) : [];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.key != null) {
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
          } else if (child.type !== Text) {
            warn(`<TransitionGroup> children must be keyed.`);
          }
        }
        return createVNode(tag, null, children);
      };
    }
  });
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c) {
    const el = c.el;
    if (el[moveCbKey]) {
      el[moveCbKey]();
    }
    if (el[enterCbKey]) {
      el[enterCbKey]();
    }
  }
  function recordPosition(c) {
    newPositionMap.set(c, c.el.getBoundingClientRect());
  }
  function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = c.el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return c;
    }
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone = el.cloneNode();
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
      });
    }
    moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
    clone.style.display = "none";
    const container = root.nodeType === 1 ? root : root.parentNode;
    container.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
  }

  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el[assignKey](domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
    deep: true,
    created(el, _, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign = el[assignKey];
        if (isArray(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign(cloned);
        } else {
          assign(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    let checked;
    if (isArray(value)) {
      checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      checked = value.has(vnode.props.value);
    } else {
      if (value === oldValue) return;
      checked = looseEqual(value, getCheckboxValue(el, true));
    }
    if (el.checked !== checked) {
      el.checked = checked;
    }
  }
  const vModelRadio = {
    created(el, { value }, vnode) {
      el.checked = looseEqual(value, vnode.props.value);
      el[assignKey] = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        el[assignKey](getValue(el));
      });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (value !== oldValue) {
        el.checked = looseEqual(value, vnode.props.value);
      }
    }
  };
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number ? looseToNumber(getValue(o)) : getValue(o)
        );
        el[assignKey](
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
        el._assigning = true;
        nextTick(() => {
          el._assigning = false;
        });
      });
      el[assignKey] = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      if (!el._assigning) {
        setSelected(el, value);
      }
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    const isArrayValue = isArray(value);
    if (isMultiple && !isArrayValue && !isSet(value)) {
      warn(
        `<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(value).slice(8, -1)}.`
      );
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArrayValue) {
          const optionType = typeof optionValue;
          if (optionType === "string" || optionType === "number") {
            option.selected = value.some((v) => String(v) === String(optionValue));
          } else {
            option.selected = looseIndexOf(value, optionValue) > -1;
          }
        } else {
          option.selected = value.has(optionValue);
        }
      } else if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) el.selectedIndex = i;
        return;
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const vModelDynamic = {
    created(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "created");
    },
    mounted(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "mounted");
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
    },
    updated(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "updated");
    }
  };
  function resolveDynamicModel(tagName, type) {
    switch (tagName) {
      case "SELECT":
        return vModelSelect;
      case "TEXTAREA":
        return vModelText;
      default:
        switch (type) {
          case "checkbox":
            return vModelCheckbox;
          case "radio":
            return vModelRadio;
          default:
            return vModelText;
        }
    }
  }
  function callModelHook(el, binding, vnode, prevVNode, hook) {
    const modelToUse = resolveDynamicModel(
      el.tagName,
      vnode.props && vnode.props.type
    );
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
  }

  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    const cache = fn._withMods || (fn._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn(event, ...args);
    }));
  };
  const keyNames = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  };
  const withKeys = (fn, modifiers) => {
    const cache = fn._withKeys || (fn._withKeys = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event) => {
      if (!("key" in event)) {
        return;
      }
      const eventKey = hyphenate(event.key);
      if (modifiers.some(
        (k) => k === eventKey || keyNames[k] === eventKey
      )) {
        return fn(event);
      }
    }));
  };

  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  let enabledHydration = false;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  function ensureHydrationRenderer() {
    renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
    enabledHydration = true;
    return renderer;
  }
  const render = ((...args) => {
    ensureRenderer().render(...args);
  });
  const hydrate = ((...args) => {
    ensureHydrationRenderer().hydrate(...args);
  });
  const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  });
  const createSSRApp = ((...args) => {
    const app = ensureHydrationRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (container) {
        return mount(container, true, resolveRootNamespace(container));
      }
    };
    return app;
  });
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
      writable: false
    });
  }
  function injectCompilerOptionsCheck(app) {
    if (isRuntimeOnly()) {
      const isCustomElement = app.config.isCustomElement;
      Object.defineProperty(app.config, "isCustomElement", {
        get() {
          return isCustomElement;
        },
        set() {
          warn(
            `The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`
          );
        }
      });
      const compilerOptions = app.config.compilerOptions;
      const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
      Object.defineProperty(app.config, "compilerOptions", {
        get() {
          warn(msg);
          return compilerOptions;
        },
        set() {
          warn(msg);
        }
      });
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      if (!res) {
        warn(
          `Failed to mount app: mount target selector "${container}" returned null.`
        );
      }
      return res;
    }
    if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
      warn(
        `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
      );
    }
    return container;
  }
  const initDirectivesForSSR = NOOP;

  function initDev() {
    {
      {
        console.info(
          `You are running a development build of Vue.
Make sure to use the production build (*.prod.js) when deploying for production.`
        );
      }
      initCustomFormatter();
    }
  }

  {
    initDev();
  }
  const compile = () => {
    {
      warn(
        `Runtime compilation is not supported in this build of Vue.` + (` Use "vue.global.js" instead.` )
      );
    }
  };

  exports.BaseTransition = BaseTransition;
  exports.BaseTransitionPropsValidators = BaseTransitionPropsValidators;
  exports.Comment = Comment;
  exports.DeprecationTypes = DeprecationTypes;
  exports.EffectScope = EffectScope;
  exports.ErrorCodes = ErrorCodes;
  exports.ErrorTypeStrings = ErrorTypeStrings;
  exports.Fragment = Fragment;
  exports.KeepAlive = KeepAlive;
  exports.ReactiveEffect = ReactiveEffect;
  exports.Static = Static;
  exports.Suspense = Suspense;
  exports.Teleport = Teleport;
  exports.Text = Text;
  exports.TrackOpTypes = TrackOpTypes;
  exports.Transition = Transition;
  exports.TransitionGroup = TransitionGroup;
  exports.TriggerOpTypes = TriggerOpTypes;
  exports.VueElement = VueElement;
  exports.assertNumber = assertNumber;
  exports.callWithAsyncErrorHandling = callWithAsyncErrorHandling;
  exports.callWithErrorHandling = callWithErrorHandling;
  exports.camelize = camelize;
  exports.capitalize = capitalize;
  exports.cloneVNode = cloneVNode;
  exports.compatUtils = compatUtils;
  exports.compile = compile;
  exports.computed = computed;
  exports.createApp = createApp;
  exports.createBlock = createBlock;
  exports.createCommentVNode = createCommentVNode;
  exports.createElementBlock = createElementBlock;
  exports.createElementVNode = createBaseVNode;
  exports.createHydrationRenderer = createHydrationRenderer;
  exports.createPropsRestProxy = createPropsRestProxy;
  exports.createRenderer = createRenderer;
  exports.createSSRApp = createSSRApp;
  exports.createSlots = createSlots;
  exports.createStaticVNode = createStaticVNode;
  exports.createTextVNode = createTextVNode;
  exports.createVNode = createVNode;
  exports.customRef = customRef;
  exports.defineAsyncComponent = defineAsyncComponent;
  exports.defineComponent = defineComponent;
  exports.defineCustomElement = defineCustomElement;
  exports.defineEmits = defineEmits;
  exports.defineExpose = defineExpose;
  exports.defineModel = defineModel;
  exports.defineOptions = defineOptions;
  exports.defineProps = defineProps;
  exports.defineSSRCustomElement = defineSSRCustomElement;
  exports.defineSlots = defineSlots;
  exports.devtools = devtools;
  exports.effect = effect;
  exports.effectScope = effectScope;
  exports.getCurrentInstance = getCurrentInstance;
  exports.getCurrentScope = getCurrentScope;
  exports.getCurrentWatcher = getCurrentWatcher;
  exports.getTransitionRawChildren = getTransitionRawChildren;
  exports.guardReactiveProps = guardReactiveProps;
  exports.h = h;
  exports.handleError = handleError;
  exports.hasInjectionContext = hasInjectionContext;
  exports.hydrate = hydrate;
  exports.hydrateOnIdle = hydrateOnIdle;
  exports.hydrateOnInteraction = hydrateOnInteraction;
  exports.hydrateOnMediaQuery = hydrateOnMediaQuery;
  exports.hydrateOnVisible = hydrateOnVisible;
  exports.initCustomFormatter = initCustomFormatter;
  exports.initDirectivesForSSR = initDirectivesForSSR;
  exports.inject = inject;
  exports.isMemoSame = isMemoSame;
  exports.isProxy = isProxy;
  exports.isReactive = isReactive;
  exports.isReadonly = isReadonly;
  exports.isRef = isRef;
  exports.isRuntimeOnly = isRuntimeOnly;
  exports.isShallow = isShallow;
  exports.isVNode = isVNode;
  exports.markRaw = markRaw;
  exports.mergeDefaults = mergeDefaults;
  exports.mergeModels = mergeModels;
  exports.mergeProps = mergeProps;
  exports.nextTick = nextTick;
  exports.normalizeClass = normalizeClass;
  exports.normalizeProps = normalizeProps;
  exports.normalizeStyle = normalizeStyle;
  exports.onActivated = onActivated;
  exports.onBeforeMount = onBeforeMount;
  exports.onBeforeUnmount = onBeforeUnmount;
  exports.onBeforeUpdate = onBeforeUpdate;
  exports.onDeactivated = onDeactivated;
  exports.onErrorCaptured = onErrorCaptured;
  exports.onMounted = onMounted;
  exports.onRenderTracked = onRenderTracked;
  exports.onRenderTriggered = onRenderTriggered;
  exports.onScopeDispose = onScopeDispose;
  exports.onServerPrefetch = onServerPrefetch;
  exports.onUnmounted = onUnmounted;
  exports.onUpdated = onUpdated;
  exports.onWatcherCleanup = onWatcherCleanup;
  exports.openBlock = openBlock;
  exports.popScopeId = popScopeId;
  exports.provide = provide;
  exports.proxyRefs = proxyRefs;
  exports.pushScopeId = pushScopeId;
  exports.queuePostFlushCb = queuePostFlushCb;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.ref = ref;
  exports.registerRuntimeCompiler = registerRuntimeCompiler;
  exports.render = render;
  exports.renderList = renderList;
  exports.renderSlot = renderSlot;
  exports.resolveComponent = resolveComponent;
  exports.resolveDirective = resolveDirective;
  exports.resolveDynamicComponent = resolveDynamicComponent;
  exports.resolveFilter = resolveFilter;
  exports.resolveTransitionHooks = resolveTransitionHooks;
  exports.setBlockTracking = setBlockTracking;
  exports.setDevtoolsHook = setDevtoolsHook;
  exports.setTransitionHooks = setTransitionHooks;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;
  exports.shallowRef = shallowRef;
  exports.ssrContextKey = ssrContextKey;
  exports.ssrUtils = ssrUtils;
  exports.stop = stop;
  exports.toDisplayString = toDisplayString;
  exports.toHandlerKey = toHandlerKey;
  exports.toHandlers = toHandlers;
  exports.toRaw = toRaw;
  exports.toRef = toRef;
  exports.toRefs = toRefs;
  exports.toValue = toValue;
  exports.transformVNodeArgs = transformVNodeArgs;
  exports.triggerRef = triggerRef;
  exports.unref = unref;
  exports.useAttrs = useAttrs;
  exports.useCssModule = useCssModule;
  exports.useCssVars = useCssVars;
  exports.useHost = useHost;
  exports.useId = useId;
  exports.useModel = useModel;
  exports.useSSRContext = useSSRContext;
  exports.useShadowRoot = useShadowRoot;
  exports.useSlots = useSlots;
  exports.useTemplateRef = useTemplateRef;
  exports.useTransitionState = useTransitionState;
  exports.vModelCheckbox = vModelCheckbox;
  exports.vModelDynamic = vModelDynamic;
  exports.vModelRadio = vModelRadio;
  exports.vModelSelect = vModelSelect;
  exports.vModelText = vModelText;
  exports.vShow = vShow;
  exports.version = version;
  exports.warn = warn;
  exports.watch = watch;
  exports.watchEffect = watchEffect;
  exports.watchPostEffect = watchPostEffect;
  exports.watchSyncEffect = watchSyncEffect;
  exports.withAsyncContext = withAsyncContext;
  exports.withCtx = withCtx;
  exports.withDefaults = withDefaults;
  exports.withDirectives = withDirectives;
  exports.withKeys = withKeys;
  exports.withMemo = withMemo;
  exports.withModifiers = withModifiers;
  exports.withScopeId = withScopeId;

  return exports;

})({});
/*!
  * vue-router v4.5.1
  * (c) 2025 Eduardo San Martin Morote
  * @license MIT
  */
var VueRouter=function(e,t){"use strict";const n="undefined"!=typeof document;function r(e){return"object"==typeof e||"displayName"in e||"props"in e||"__vccOpts"in e}function o(e){return e.__esModule||"Module"===e[Symbol.toStringTag]||e.default&&r(e.default)}const a=Object.assign;function c(e,t){const n={};for(const r in t){const o=t[r];n[r]=i(o)?o.map(e):e(o)}return n}const s=()=>{},i=Array.isArray,l=/#/g,u=/&/g,f=/\//g,p=/=/g,h=/\?/g,d=/\+/g,m=/%5B/g,g=/%5D/g,v=/%5E/g,y=/%60/g,b=/%7B/g,w=/%7C/g,E=/%7D/g,R=/%20/g;function k(e){return encodeURI(""+e).replace(w,"|").replace(m,"[").replace(g,"]")}function O(e){return k(e).replace(d,"%2B").replace(R,"+").replace(l,"%23").replace(u,"%26").replace(y,"`").replace(b,"{").replace(E,"}").replace(v,"^")}function j(e){return null==e?"":function(e){return k(e).replace(l,"%23").replace(h,"%3F")}(e).replace(f,"%2F")}function P(e){try{return decodeURIComponent(""+e)}catch(e){}return""+e}const C=/\/$/,x=e=>e.replace(C,"");function $(e,t,n="/"){let r,o={},a="",c="";const s=t.indexOf("#");let i=t.indexOf("?");return s<i&&s>=0&&(i=-1),i>-1&&(r=t.slice(0,i),a=t.slice(i+1,s>-1?s:t.length),o=e(a)),s>-1&&(r=r||t.slice(0,s),c=t.slice(s,t.length)),r=function(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),r=e.split("/"),o=r[r.length-1];".."!==o&&"."!==o||r.push("");let a,c,s=n.length-1;for(a=0;a<r.length;a++)if(c=r[a],"."!==c){if(".."!==c)break;s>1&&s--}return n.slice(0,s).join("/")+"/"+r.slice(a).join("/")}(null!=r?r:t,n),{fullPath:r+(a&&"?")+a+c,path:r,query:o,hash:P(c)}}function S(e,t){return t&&e.toLowerCase().startsWith(t.toLowerCase())?e.slice(t.length)||"/":e}function A(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function L(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!M(e[n],t[n]))return!1;return!0}function M(e,t){return i(e)?T(e,t):i(t)?T(t,e):e===t}function T(e,t){return i(t)?e.length===t.length&&e.every(((e,n)=>e===t[n])):1===e.length&&e[0]===t}const q={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var B,G;!function(e){e.pop="pop",e.push="push"}(B||(B={})),function(e){e.back="back",e.forward="forward",e.unknown=""}(G||(G={}));function V(e){if(!e)if(n){const t=document.querySelector("base");e=(e=t&&t.getAttribute("href")||"/").replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return"/"!==e[0]&&"#"!==e[0]&&(e="/"+e),x(e)}const W=/^[^#]+#/;function _(e,t){return e.replace(W,"#")+t}const F=()=>({left:window.scrollX,top:window.scrollY});function I(e){let t;if("el"in e){const n=e.el,r="string"==typeof n&&n.startsWith("#"),o="string"==typeof n?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=function(e,t){const n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(null!=t.left?t.left:window.scrollX,null!=t.top?t.top:window.scrollY)}function D(e,t){return(history.state?history.state.position-t:-1)+e}const K=new Map;let U=()=>location.protocol+"//"+location.host;function H(e,t){const{pathname:n,search:r,hash:o}=t,a=e.indexOf("#");if(a>-1){let t=o.includes(e.slice(a))?e.slice(a).length:1,n=o.slice(t);return"/"!==n[0]&&(n="/"+n),S(n,"")}return S(n,e)+r+o}function N(e,t,n,r=!1,o=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:o?F():null}}function z(e){const t=function(e){const{history:t,location:n}=window,r={value:H(e,n)},o={value:t.state};function c(r,a,c){const s=e.indexOf("#"),i=s>-1?(n.host&&document.querySelector("base")?e:e.slice(s))+r:U()+e+r;try{t[c?"replaceState":"pushState"](a,"",i),o.value=a}catch(e){console.error(e),n[c?"replace":"assign"](i)}}return o.value||c(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0),{location:r,state:o,push:function(e,n){const s=a({},o.value,t.state,{forward:e,scroll:F()});c(s.current,s,!0),c(e,a({},N(r.value,e,null),{position:s.position+1},n),!1),r.value=e},replace:function(e,n){c(e,a({},t.state,N(o.value.back,e,o.value.forward,!0),n,{position:o.value.position}),!0),r.value=e}}}(e=V(e)),n=function(e,t,n,r){let o=[],c=[],s=null;const i=({state:a})=>{const c=H(e,location),i=n.value,l=t.value;let u=0;if(a){if(n.value=c,t.value=a,s&&s===i)return void(s=null);u=l?a.position-l.position:0}else r(c);o.forEach((e=>{e(n.value,i,{delta:u,type:B.pop,direction:u?u>0?G.forward:G.back:G.unknown})}))};function l(){const{history:e}=window;e.state&&e.replaceState(a({},e.state,{scroll:F()}),"")}return window.addEventListener("popstate",i),window.addEventListener("beforeunload",l,{passive:!0}),{pauseListeners:function(){s=n.value},listen:function(e){o.push(e);const t=()=>{const t=o.indexOf(e);t>-1&&o.splice(t,1)};return c.push(t),t},destroy:function(){for(const e of c)e();c=[],window.removeEventListener("popstate",i),window.removeEventListener("beforeunload",l)}}}(e,t.state,t.location,t.replace);const r=a({location:"",base:e,go:function(e,t=!0){t||n.pauseListeners(),history.go(e)},createHref:_.bind(null,e)},t,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>t.state.value}),r}function Q(e){return"string"==typeof e||"symbol"==typeof e}const X=Symbol("");var Y;function Z(e,t){return a(new Error,{type:e,[X]:!0},t)}function J(e,t){return e instanceof Error&&X in e&&(null==t||!!(e.type&t))}e.NavigationFailureType=void 0,(Y=e.NavigationFailureType||(e.NavigationFailureType={}))[Y.aborted=4]="aborted",Y[Y.cancelled=8]="cancelled",Y[Y.duplicated=16]="duplicated";const ee="[^/]+?",te={sensitive:!1,strict:!1,start:!0,end:!0},ne=/[.+*?^${}()[\]/\\]/g;function re(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?1===e.length&&80===e[0]?-1:1:e.length>t.length?1===t.length&&80===t[0]?1:-1:0}function oe(e,t){let n=0;const r=e.score,o=t.score;for(;n<r.length&&n<o.length;){const e=re(r[n],o[n]);if(e)return e;n++}if(1===Math.abs(o.length-r.length)){if(ae(r))return 1;if(ae(o))return-1}return o.length-r.length}function ae(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const ce={type:0,value:""},se=/[a-zA-Z0-9_]/;function ie(e,t,n){const r=function(e,t){const n=a({},te,t),r=[];let o=n.start?"^":"";const c=[];for(const t of e){const e=t.length?[]:[90];n.strict&&!t.length&&(o+="/");for(let r=0;r<t.length;r++){const a=t[r];let s=40+(n.sensitive?.25:0);if(0===a.type)r||(o+="/"),o+=a.value.replace(ne,"\\$&"),s+=40;else if(1===a.type){const{value:e,repeatable:n,optional:i,regexp:l}=a;c.push({name:e,repeatable:n,optional:i});const u=l||ee;if(u!==ee){s+=10;try{new RegExp(`(${u})`)}catch(t){throw new Error(`Invalid custom RegExp for param "${e}" (${u}): `+t.message)}}let f=n?`((?:${u})(?:/(?:${u}))*)`:`(${u})`;r||(f=i&&t.length<2?`(?:/${f})`:"/"+f),i&&(f+="?"),o+=f,s+=20,i&&(s+=-8),n&&(s+=-20),".*"===u&&(s+=-50)}e.push(s)}r.push(e)}if(n.strict&&n.end){const e=r.length-1;r[e][r[e].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&!o.endsWith("/")&&(o+="(?:/|$)");const s=new RegExp(o,n.sensitive?"":"i");return{re:s,score:r,keys:c,parse:function(e){const t=e.match(s),n={};if(!t)return null;for(let e=1;e<t.length;e++){const r=t[e]||"",o=c[e-1];n[o.name]=r&&o.repeatable?r.split("/"):r}return n},stringify:function(t){let n="",r=!1;for(const o of e){r&&n.endsWith("/")||(n+="/"),r=!1;for(const e of o)if(0===e.type)n+=e.value;else if(1===e.type){const{value:a,repeatable:c,optional:s}=e,l=a in t?t[a]:"";if(i(l)&&!c)throw new Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);const u=i(l)?l.join("/"):l;if(!u){if(!s)throw new Error(`Missing required param "${a}"`);o.length<2&&(n.endsWith("/")?n=n.slice(0,-1):r=!0)}n+=u}}return n||"/"}}}(function(e){if(!e)return[[]];if("/"===e)return[[ce]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(e){throw new Error(`ERR (${n})/"${l}": ${e}`)}let n=0,r=n;const o=[];let a;function c(){a&&o.push(a),a=[]}let s,i=0,l="",u="";function f(){l&&(0===n?a.push({type:0,value:l}):1===n||2===n||3===n?(a.length>1&&("*"===s||"+"===s)&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),a.push({type:1,value:l,regexp:u,repeatable:"*"===s||"+"===s,optional:"*"===s||"?"===s})):t("Invalid state to consume buffer"),l="")}function p(){l+=s}for(;i<e.length;)if(s=e[i++],"\\"!==s||2===n)switch(n){case 0:"/"===s?(l&&f(),c()):":"===s?(f(),n=1):p();break;case 4:p(),n=r;break;case 1:"("===s?n=2:se.test(s)?p():(f(),n=0,"*"!==s&&"?"!==s&&"+"!==s&&i--);break;case 2:")"===s?"\\"==u[u.length-1]?u=u.slice(0,-1)+s:n=3:u+=s;break;case 3:f(),n=0,"*"!==s&&"?"!==s&&"+"!==s&&i--,u="";break;default:t("Unknown state")}else r=n,n=4;return 2===n&&t(`Unfinished custom RegExp for param "${l}"`),f(),c(),o}(e.path),n),o=a(r,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function le(e,t){const n=[],r=new Map;function o(e,n,r){const l=!r,u=fe(e);u.aliasOf=r&&r.record;const f=me(t,e),p=[u];if("alias"in e){const t="string"==typeof e.alias?[e.alias]:e.alias;for(const e of t)p.push(fe(a({},u,{components:r?r.record.components:u.components,path:e,aliasOf:r?r.record:u})))}let h,d;for(const t of p){const{path:a}=t;if(n&&"/"!==a[0]){const e=n.record.path;t.path=n.record.path+(a&&("/"===e[e.length-1]?"":"/")+a)}if(h=ie(t,n,f),r?r.alias.push(h):(d=d||h,d!==h&&d.alias.push(h),l&&e.name&&!he(h)&&c(e.name)),ge(h)&&i(h),u.children){const e=u.children;for(let t=0;t<e.length;t++)o(e[t],h,r&&r.children[t])}r=r||h}return d?()=>{c(d)}:s}function c(e){if(Q(e)){const t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(c),t.alias.forEach(c))}else{const t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(c),e.alias.forEach(c))}}function i(e){const t=function(e,t){let n=0,r=t.length;for(;n!==r;){const o=n+r>>1;oe(e,t[o])<0?r=o:n=o+1}const o=function(e){let t=e;for(;t=t.parent;)if(ge(t)&&0===oe(e,t))return t;return}(e);o&&(r=t.lastIndexOf(o,r-1));return r}(e,n);n.splice(t,0,e),e.record.name&&!he(e)&&r.set(e.record.name,e)}return t=me({strict:!1,end:!0,sensitive:!1},t),e.forEach((e=>o(e))),{addRoute:o,resolve:function(e,t){let o,c,s,i={};if("name"in e&&e.name){if(o=r.get(e.name),!o)throw Z(1,{location:e});s=o.record.name,i=a(ue(t.params,o.keys.filter((e=>!e.optional)).concat(o.parent?o.parent.keys.filter((e=>e.optional)):[]).map((e=>e.name))),e.params&&ue(e.params,o.keys.map((e=>e.name)))),c=o.stringify(i)}else if(null!=e.path)c=e.path,o=n.find((e=>e.re.test(c))),o&&(i=o.parse(c),s=o.record.name);else{if(o=t.name?r.get(t.name):n.find((e=>e.re.test(t.path))),!o)throw Z(1,{location:e,currentLocation:t});s=o.record.name,i=a({},t.params,e.params),c=o.stringify(i)}const l=[];let u=o;for(;u;)l.unshift(u.record),u=u.parent;return{name:s,path:c,params:i,matched:l,meta:de(l)}},removeRoute:c,clearRoutes:function(){n.length=0,r.clear()},getRoutes:function(){return n},getRecordMatcher:function(e){return r.get(e)}}}function ue(e,t){const n={};for(const r of t)r in e&&(n[r]=e[r]);return n}function fe(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:pe(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function pe(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const r in e.components)t[r]="object"==typeof n?n[r]:n;return t}function he(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function de(e){return e.reduce(((e,t)=>a(e,t.meta)),{})}function me(e,t){const n={};for(const r in e)n[r]=r in t?t[r]:e[r];return n}function ge({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function ve(e){const t={};if(""===e||"?"===e)return t;const n=("?"===e[0]?e.slice(1):e).split("&");for(let e=0;e<n.length;++e){const r=n[e].replace(d," "),o=r.indexOf("="),a=P(o<0?r:r.slice(0,o)),c=o<0?null:P(r.slice(o+1));if(a in t){let e=t[a];i(e)||(e=t[a]=[e]),e.push(c)}else t[a]=c}return t}function ye(e){let t="";for(let n in e){const r=e[n];if(n=O(n).replace(p,"%3D"),null==r){void 0!==r&&(t+=(t.length?"&":"")+n);continue}(i(r)?r.map((e=>e&&O(e))):[r&&O(r)]).forEach((e=>{void 0!==e&&(t+=(t.length?"&":"")+n,null!=e&&(t+="="+e))}))}return t}function be(e){const t={};for(const n in e){const r=e[n];void 0!==r&&(t[n]=i(r)?r.map((e=>null==e?null:""+e)):null==r?r:""+r)}return t}const we=Symbol(""),Ee=Symbol(""),Re=Symbol(""),ke=Symbol(""),Oe=Symbol("");function je(){let e=[];return{add:function(t){return e.push(t),()=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)}},list:()=>e.slice(),reset:function(){e=[]}}}function Pe(e,n,r){const o=()=>{e[n].delete(r)};t.onUnmounted(o),t.onDeactivated(o),t.onActivated((()=>{e[n].add(r)})),e[n].add(r)}function Ce(e,t,n,r,o,a=e=>e()){const c=r&&(r.enterCallbacks[o]=r.enterCallbacks[o]||[]);return()=>new Promise(((s,i)=>{const l=e=>{var a;!1===e?i(Z(4,{from:n,to:t})):e instanceof Error?i(e):"string"==typeof(a=e)||a&&"object"==typeof a?i(Z(2,{from:t,to:e})):(c&&r.enterCallbacks[o]===c&&"function"==typeof e&&c.push(e),s())},u=a((()=>e.call(r&&r.instances[o],t,n,l)));let f=Promise.resolve(u);e.length<3&&(f=f.then(l)),f.catch((e=>i(e)))}))}function xe(e,t,n,a,c=e=>e()){const s=[];for(const i of e)for(const e in i.components){let l=i.components[e];if("beforeRouteEnter"===t||i.instances[e])if(r(l)){const r=(l.__vccOpts||l)[t];r&&s.push(Ce(r,n,a,i,e,c))}else{let r=l();s.push((()=>r.then((r=>{if(!r)throw new Error(`Couldn't resolve component "${e}" at "${i.path}"`);const s=o(r)?r.default:r;i.mods[e]=r,i.components[e]=s;const l=(s.__vccOpts||s)[t];return l&&Ce(l,n,a,i,e,c)()}))))}}return s}function $e(e){const n=t.inject(Re),r=t.inject(ke),o=t.computed((()=>{const r=t.unref(e.to);return n.resolve(r)})),a=t.computed((()=>{const{matched:e}=o.value,{length:t}=e,n=e[t-1],a=r.matched;if(!n||!a.length)return-1;const c=a.findIndex(A.bind(null,n));if(c>-1)return c;const s=Ae(e[t-2]);return t>1&&Ae(n)===s&&a[a.length-1].path!==s?a.findIndex(A.bind(null,e[t-2])):c})),c=t.computed((()=>a.value>-1&&function(e,t){for(const n in t){const r=t[n],o=e[n];if("string"==typeof r){if(r!==o)return!1}else if(!i(o)||o.length!==r.length||r.some(((e,t)=>e!==o[t])))return!1}return!0}(r.params,o.value.params))),l=t.computed((()=>a.value>-1&&a.value===r.matched.length-1&&L(r.params,o.value.params)));return{route:o,href:t.computed((()=>o.value.href)),isActive:c,isExactActive:l,navigate:function(r={}){if(function(e){if(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)return;if(e.defaultPrevented)return;if(void 0!==e.button&&0!==e.button)return;if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}e.preventDefault&&e.preventDefault();return!0}(r)){const r=n[t.unref(e.replace)?"replace":"push"](t.unref(e.to)).catch(s);return e.viewTransition&&"undefined"!=typeof document&&"startViewTransition"in document&&document.startViewTransition((()=>r)),r}return Promise.resolve()}}}const Se=t.defineComponent({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:$e,setup(e,{slots:n}){const r=t.reactive($e(e)),{options:o}=t.inject(Re),a=t.computed((()=>({[Le(e.activeClass,o.linkActiveClass,"router-link-active")]:r.isActive,[Le(e.exactActiveClass,o.linkExactActiveClass,"router-link-exact-active")]:r.isExactActive})));return()=>{const o=n.default&&(1===(c=n.default(r)).length?c[0]:c);var c;return e.custom?o:t.h("a",{"aria-current":r.isExactActive?e.ariaCurrentValue:null,href:r.href,onClick:r.navigate,class:a.value},o)}}});function Ae(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Le=(e,t,n)=>null!=e?e:null!=t?t:n;function Me(e,t){if(!e)return null;const n=e(t);return 1===n.length?n[0]:n}const Te=t.defineComponent({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:n,slots:r}){const o=t.inject(Oe),c=t.computed((()=>e.route||o.value)),s=t.inject(Ee,0),i=t.computed((()=>{let e=t.unref(s);const{matched:n}=c.value;let r;for(;(r=n[e])&&!r.components;)e++;return e})),l=t.computed((()=>c.value.matched[i.value]));t.provide(Ee,t.computed((()=>i.value+1))),t.provide(we,l),t.provide(Oe,c);const u=t.ref();return t.watch((()=>[u.value,l.value,e.name]),(([e,t,n],[r,o,a])=>{t&&(t.instances[n]=e,o&&o!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=o.leaveGuards),t.updateGuards.size||(t.updateGuards=o.updateGuards))),!e||!t||o&&A(t,o)&&r||(t.enterCallbacks[n]||[]).forEach((t=>t(e)))}),{flush:"post"}),()=>{const o=c.value,s=e.name,i=l.value,f=i&&i.components[s];if(!f)return Me(r.default,{Component:f,route:o});const p=i.props[s],h=p?!0===p?o.params:"function"==typeof p?p(o):p:null,d=t.h(f,a({},h,n,{onVnodeUnmounted:e=>{e.component.isUnmounted&&(i.instances[s]=null)},ref:u}));return Me(r.default,{Component:d,route:o})||d}}});return e.RouterLink=Se,e.RouterView=Te,e.START_LOCATION=q,e.createMemoryHistory=function(e=""){let t=[],n=[["",{}]],r=0;function o(e,t={}){r++,r!==n.length&&n.splice(r),n.push([e,t])}const a={location:"",state:{},base:e=V(e),createHref:_.bind(null,e),replace(e,t){n.splice(r--,1),o(e,t)},push(e,t){o(e,t)},listen:e=>(t.push(e),()=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)}),destroy(){t=[],n=[["",{}]],r=0},go(e,o=!0){const a=this.location,c=e<0?G.back:G.forward;r=Math.max(0,Math.min(r+e,n.length-1)),o&&function(e,n,{direction:r,delta:o}){const a={direction:r,delta:o,type:B.pop};for(const r of t)r(e,n,a)}(this.location,a,{direction:c,delta:e})}};return Object.defineProperty(a,"location",{enumerable:!0,get:()=>n[r][0]}),Object.defineProperty(a,"state",{enumerable:!0,get:()=>n[r][1]}),a},e.createRouter=function(e){const r=le(e.routes,e),o=e.parseQuery||ve,l=e.stringifyQuery||ye,u=e.history,f=je(),p=je(),h=je(),d=t.shallowRef(q);let m=q;n&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const g=c.bind(null,(e=>""+e)),y=c.bind(null,j),w=c.bind(null,P);function R(e,t){if(t=a({},t||d.value),"string"==typeof e){const n=$(o,e,t.path),c=r.resolve({path:n.path},t),s=u.createHref(n.fullPath);return a(n,c,{params:w(c.params),hash:P(n.hash),redirectedFrom:void 0,href:s})}let n;if(null!=e.path)n=a({},e,{path:$(o,e.path,t.path).path});else{const r=a({},e.params);for(const e in r)null==r[e]&&delete r[e];n=a({},e,{params:y(r)}),t.params=y(t.params)}const c=r.resolve(n,t),s=e.hash||"";c.params=g(w(c.params));const i=function(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}(l,a({},e,{hash:(f=s,k(f).replace(b,"{").replace(E,"}").replace(v,"^")),path:c.path}));var f;const p=u.createHref(i);return a({fullPath:i,hash:s,query:l===ye?be(e.query):e.query||{}},c,{redirectedFrom:void 0,href:p})}function O(e){return"string"==typeof e?$(o,e,d.value.path):a({},e)}function C(e,t){if(m!==e)return Z(8,{from:t,to:e})}function x(e){return M(e)}function S(e){const t=e.matched[e.matched.length-1];if(t&&t.redirect){const{redirect:n}=t;let r="function"==typeof n?n(e):n;return"string"==typeof r&&(r=r.includes("?")||r.includes("#")?r=O(r):{path:r},r.params={}),a({query:e.query,hash:e.hash,params:null!=r.path?{}:e.params},r)}}function M(e,t){const n=m=R(e),r=d.value,o=e.state,c=e.force,s=!0===e.replace,i=S(n);if(i)return M(a(O(i),{state:"object"==typeof i?a({},o,i.state):o,force:c,replace:s}),t||n);const u=n;let f;return u.redirectedFrom=t,!c&&function(e,t,n){const r=t.matched.length-1,o=n.matched.length-1;return r>-1&&r===o&&A(t.matched[r],n.matched[o])&&L(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}(l,r,n)&&(f=Z(16,{to:u,from:r}),te(r,r,!0,!1)),(f?Promise.resolve(f):V(u,r)).catch((e=>J(e)?J(e,2)?e:ee(e):Y(e,u,r))).then((e=>{if(e){if(J(e,2))return M(a({replace:s},O(e.to),{state:"object"==typeof e.to?a({},o,e.to.state):o,force:c}),t||u)}else e=_(u,r,!0,s,o);return W(u,r,e),e}))}function T(e,t){const n=C(e,t);return n?Promise.reject(n):Promise.resolve()}function G(e){const t=oe.values().next().value;return t&&"function"==typeof t.runWithContext?t.runWithContext(e):e()}function V(e,t){let n;const[r,o,a]=function(e,t){const n=[],r=[],o=[],a=Math.max(t.matched.length,e.matched.length);for(let c=0;c<a;c++){const a=t.matched[c];a&&(e.matched.find((e=>A(e,a)))?r.push(a):n.push(a));const s=e.matched[c];s&&(t.matched.find((e=>A(e,s)))||o.push(s))}return[n,r,o]}(e,t);n=xe(r.reverse(),"beforeRouteLeave",e,t);for(const o of r)o.leaveGuards.forEach((r=>{n.push(Ce(r,e,t))}));const c=T.bind(null,e,t);return n.push(c),ce(n).then((()=>{n=[];for(const r of f.list())n.push(Ce(r,e,t));return n.push(c),ce(n)})).then((()=>{n=xe(o,"beforeRouteUpdate",e,t);for(const r of o)r.updateGuards.forEach((r=>{n.push(Ce(r,e,t))}));return n.push(c),ce(n)})).then((()=>{n=[];for(const r of a)if(r.beforeEnter)if(i(r.beforeEnter))for(const o of r.beforeEnter)n.push(Ce(o,e,t));else n.push(Ce(r.beforeEnter,e,t));return n.push(c),ce(n)})).then((()=>(e.matched.forEach((e=>e.enterCallbacks={})),n=xe(a,"beforeRouteEnter",e,t,G),n.push(c),ce(n)))).then((()=>{n=[];for(const r of p.list())n.push(Ce(r,e,t));return n.push(c),ce(n)})).catch((e=>J(e,8)?e:Promise.reject(e)))}function W(e,t,n){h.list().forEach((r=>G((()=>r(e,t,n)))))}function _(e,t,r,o,c){const s=C(e,t);if(s)return s;const i=t===q,l=n?history.state:{};r&&(o||i?u.replace(e.fullPath,a({scroll:i&&l&&l.scroll},c)):u.push(e.fullPath,c)),d.value=e,te(e,t,r,i),ee()}let U;function H(){U||(U=u.listen(((e,t,r)=>{if(!ae.listening)return;const o=R(e),c=S(o);if(c)return void M(a(c,{replace:!0,force:!0}),o).catch(s);m=o;const i=d.value;var l,f;n&&(l=D(i.fullPath,r.delta),f=F(),K.set(l,f)),V(o,i).catch((e=>J(e,12)?e:J(e,2)?(M(a(O(e.to),{force:!0}),o).then((e=>{J(e,20)&&!r.delta&&r.type===B.pop&&u.go(-1,!1)})).catch(s),Promise.reject()):(r.delta&&u.go(-r.delta,!1),Y(e,o,i)))).then((e=>{(e=e||_(o,i,!1))&&(r.delta&&!J(e,8)?u.go(-r.delta,!1):r.type===B.pop&&J(e,20)&&u.go(-1,!1)),W(o,i,e)})).catch(s)})))}let N,z=je(),X=je();function Y(e,t,n){ee(e);const r=X.list();return r.length?r.forEach((r=>r(e,t,n))):console.error(e),Promise.reject(e)}function ee(e){return N||(N=!e,H(),z.list().forEach((([t,n])=>e?n(e):t())),z.reset()),e}function te(r,o,a,c){const{scrollBehavior:s}=e;if(!n||!s)return Promise.resolve();const i=!a&&function(e){const t=K.get(e);return K.delete(e),t}(D(r.fullPath,0))||(c||!a)&&history.state&&history.state.scroll||null;return t.nextTick().then((()=>s(r,o,i))).then((e=>e&&I(e))).catch((e=>Y(e,r,o)))}const ne=e=>u.go(e);let re;const oe=new Set,ae={currentRoute:d,listening:!0,addRoute:function(e,t){let n,o;return Q(e)?(n=r.getRecordMatcher(e),o=t):o=e,r.addRoute(o,n)},removeRoute:function(e){const t=r.getRecordMatcher(e);t&&r.removeRoute(t)},clearRoutes:r.clearRoutes,hasRoute:function(e){return!!r.getRecordMatcher(e)},getRoutes:function(){return r.getRoutes().map((e=>e.record))},resolve:R,options:e,push:x,replace:function(e){return x(a(O(e),{replace:!0}))},go:ne,back:()=>ne(-1),forward:()=>ne(1),beforeEach:f.add,beforeResolve:p.add,afterEach:h.add,onError:X.add,isReady:function(){return N&&d.value!==q?Promise.resolve():new Promise(((e,t)=>{z.add([e,t])}))},install(e){e.component("RouterLink",Se),e.component("RouterView",Te),e.config.globalProperties.$router=this,Object.defineProperty(e.config.globalProperties,"$route",{enumerable:!0,get:()=>t.unref(d)}),n&&!re&&d.value===q&&(re=!0,x(u.location).catch((e=>{})));const r={};for(const e in q)Object.defineProperty(r,e,{get:()=>d.value[e],enumerable:!0});e.provide(Re,this),e.provide(ke,t.shallowReactive(r)),e.provide(Oe,d);const o=e.unmount;oe.add(e),e.unmount=function(){oe.delete(e),oe.size<1&&(m=q,U&&U(),U=null,d.value=q,re=!1,N=!1),o()}}};function ce(e){return e.reduce(((e,t)=>e.then((()=>G(t)))),Promise.resolve())}return ae},e.createRouterMatcher=le,e.createWebHashHistory=function(e){return(e=location.host?e||location.pathname+location.search:"").includes("#")||(e+="#"),z(e)},e.createWebHistory=z,e.isNavigationFailure=J,e.loadRouteLocation=function(e){return e.matched.every((e=>e.redirect))?Promise.reject(new Error("Cannot load a route that redirects.")):Promise.all(e.matched.map((e=>e.components&&Promise.all(Object.keys(e.components).reduce(((t,n)=>{const r=e.components[n];return"function"!=typeof r||"displayName"in r||t.push(r().then((t=>{if(!t)return Promise.reject(new Error(`Couldn't resolve component "${n}" at "${e.path}". Ensure you passed a function that returns a promise.`));const r=o(t)?t.default:t;e.mods[n]=t,e.components[n]=r}))),t}),[]))))).then((()=>e))},e.matchedRouteKey=we,e.onBeforeRouteLeave=function(e){const n=t.inject(we,{}).value;n&&Pe(n,"leaveGuards",e)},e.onBeforeRouteUpdate=function(e){const n=t.inject(we,{}).value;n&&Pe(n,"updateGuards",e)},e.parseQuery=ve,e.routeLocationKey=ke,e.routerKey=Re,e.routerViewLocationKey=Oe,e.stringifyQuery=ye,e.useLink=$e,e.useRoute=function(e){return t.inject(ke)},e.useRouter=function(){return t.inject(Re)},e.viewDepthKey=Ee,e}({},Vue);
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("vue")):"function"==typeof define&&define.amd?define(["exports","vue"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).vant={},e.Vue)}(this,function(e,t){"use strict";function o(){}const a=Object.assign,n="undefined"!=typeof window,r=e=>null!==e&&"object"==typeof e,l=e=>null!=e,i=e=>"function"==typeof e,s=e=>r(e)&&i(e.then)&&i(e.catch),c=e=>"[object Date]"===Object.prototype.toString.call(e)&&!Number.isNaN(e.getTime());function d(e){return e=e.replace(/[^-|\d]/g,""),/^((\+86)|(86))?(1)\d{10}$/.test(e)||/^0[0-9-]{10,13}$/.test(e)}const u=e=>"number"==typeof e||/^\d+(\.\d+)?$/.test(e);function p(e,t){const o=t.split(".");let a=e;return o.forEach(e=>{var t;a=r(a)&&null!=(t=a[e])?t:""}),a}function v(e,t,o){return t.reduce((t,a)=>(o&&void 0===e[a]||(t[a]=e[a]),t),{})}const m=(e,t)=>JSON.stringify(e)===JSON.stringify(t),f=e=>Array.isArray(e)?e:[e],h=null,g=[Number,String],b={type:Boolean,default:!0},y=e=>({type:e,required:!0}),w=()=>({type:Array,default:()=>[]}),x=e=>({type:Number,default:e}),V=e=>({type:g,default:e}),N=e=>({type:String,default:e}),C="undefined"!=typeof window;function k(e){return C?requestAnimationFrame(e):-1}function S(e){C&&cancelAnimationFrame(e)}function T(e){k(()=>k(e))}const B=(e,t)=>({top:0,left:0,right:e,bottom:t,width:e,height:t}),P=e=>{const o=t.unref(e);if(o===window){const e=o.innerWidth,t=o.innerHeight;return B(e,t)}return(null==o?void 0:o.getBoundingClientRect)?o.getBoundingClientRect():B(0,0)};function D(e){const o=t.inject(e,null);if(o){const e=t.getCurrentInstance(),{link:a,unlink:n,internalChildren:r}=o;a(e),t.onUnmounted(()=>n(e));return{parent:o,index:t.computed(()=>r.indexOf(e))}}return{parent:null,index:t.ref(-1)}}const O=(e,t)=>{const o=e.indexOf(t);return-1===o?e.findIndex(e=>void 0!==t.key&&null!==t.key&&e.type===t.type&&e.key===t.key):o};function A(e,o,a){const n=function(e){const o=[],a=e=>{Array.isArray(e)&&e.forEach(e=>{var n;t.isVNode(e)&&(o.push(e),(null==(n=e.component)?void 0:n.subTree)&&(o.push(e.component.subTree),a(e.component.subTree.children)),e.children&&a(e.children))})};return a(e),o}(e.subTree.children);a.sort((e,t)=>O(n,e.vnode)-O(n,t.vnode));const r=a.map(e=>e.proxy);o.sort((e,t)=>r.indexOf(e)-r.indexOf(t))}function I(e){const o=t.reactive([]),a=t.reactive([]),n=t.getCurrentInstance();return{children:o,linkChildren:r=>{t.provide(e,Object.assign({link:e=>{e.proxy&&(a.push(e),o.push(e.proxy),A(n,o,a))},unlink:e=>{const t=a.indexOf(e);o.splice(t,1),a.splice(t,1)},children:o,internalChildren:a},r))}}}const z=1e3,E=6e4,$=36e5,L=24*$;function M(e){let o,a,n,r;const l=t.ref(e.time),i=t.computed(()=>{return{total:e=l.value,days:Math.floor(e/L),hours:Math.floor(e%L/$),minutes:Math.floor(e%$/E),seconds:Math.floor(e%E/z),milliseconds:Math.floor(e%z)};var e}),s=()=>{n=!1,S(o)},c=()=>Math.max(a-Date.now(),0),d=t=>{var o,a;(l.value=t,null==(o=e.onChange)||o.call(e,i.value),0===t)&&(s(),null==(a=e.onFinish)||a.call(e))},u=()=>{o=k(()=>{n&&(d(c()),l.value>0&&u())})},p=()=>{o=k(()=>{if(n){const o=c();e=o,t=l.value,(Math.floor(e/1e3)!==Math.floor(t/1e3)||0===o)&&d(o),l.value>0&&p()}var e,t})},v=()=>{C&&(e.millisecond?u():p())};return t.onBeforeUnmount(s),t.onActivated(()=>{r&&(n=!0,r=!1,v())}),t.onDeactivated(()=>{n&&(s(),r=!0)}),{start:()=>{n||(a=Date.now()+l.value,n=!0,v())},pause:s,reset:(t=e.time)=>{s(),l.value=t},current:i}}function F(e){let o;t.onMounted(()=>{e(),t.nextTick(()=>{o=!0})}),t.onActivated(()=>{o&&e()})}function R(e,o,a={}){if(!C)return;const{target:n=window,passive:r=!1,capture:l=!1}=a;let i,s=!1;const c=a=>{if(s)return;const n=t.unref(a);n&&!i&&(n.addEventListener(e,o,{capture:l,passive:r}),i=!0)},d=a=>{if(s)return;const n=t.unref(a);n&&i&&(n.removeEventListener(e,o,l),i=!1)};let u;return t.onUnmounted(()=>d(n)),t.onDeactivated(()=>d(n)),F(()=>c(n)),t.isRef(n)&&(u=t.watch(n,(e,t)=>{d(t),c(e)})),()=>{null==u||u(),d(n),s=!0}}function H(e,o,a={}){if(!C)return;const{eventName:n="click"}=a;R(n,a=>{(Array.isArray(e)?e:[e]).every(e=>{const o=t.unref(e);return o&&!o.contains(a.target)})&&o(a)},{target:document})}let j,W;const U=/scroll|auto|overlay/i,Y=C?window:void 0;function X(e){return"HTML"!==e.tagName&&"BODY"!==e.tagName&&1===e.nodeType}function q(e,t=Y){let o=e;for(;o&&o!==t&&X(o);){const{overflowY:e}=window.getComputedStyle(o);if(U.test(e))return o;o=o.parentNode}return t}function G(e,o=Y){const a=t.ref();return t.onMounted(()=>{e.value&&(a.value=q(e.value,o))}),a}let Z;const K=Symbol("van-field");function _(e){const o=t.inject(K,null);o&&!o.customValue.value&&(o.customValue.value=e,t.watch(e,()=>{o.resetValidation(),o.validateWithTrigger("onChange")}))}function J(e){const t="scrollTop"in e?e.scrollTop:e.pageYOffset;return Math.max(t,0)}function Q(e,t){"scrollTop"in e?e.scrollTop=t:e.scrollTo(e.scrollX,t)}function ee(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0}function te(e){Q(window,e),Q(document.body,e)}function oe(e,t){if(e===window)return 0;const o=t?J(t):ee();return P(e).top+o}const ae=!!n&&/ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());function ne(){ae&&te(ee())}const re=e=>e.stopPropagation();function le(e,t){("boolean"!=typeof e.cancelable||e.cancelable)&&e.preventDefault(),t&&re(e)}function ie(e){const o=t.unref(e);if(!o)return!1;const a=window.getComputedStyle(o),n="none"===a.display,r=null===o.offsetParent&&"fixed"!==a.position;return n||r}const{width:se,height:ce}=function(){if(!j&&(j=t.ref(0),W=t.ref(0),C)){const e=()=>{j.value=window.innerWidth,W.value=window.innerHeight};e(),window.addEventListener("resize",e,{passive:!0}),window.addEventListener("orientationchange",e,{passive:!0})}return{width:j,height:W}}();function de(e){const t=window.getComputedStyle(e);return"none"!==t.transform||"none"!==t.perspective||["transform","perspective","filter"].some(e=>(t.willChange||"").includes(e))}function ue(e){if(l(e))return u(e)?`${e}px`:String(e)}function pe(e){if(l(e)){if(Array.isArray(e))return{width:ue(e[0]),height:ue(e[1])};const t=ue(e);return{width:t,height:t}}}function ve(e){const t={};return void 0!==e&&(t.zIndex=+e),t}let me;function fe(e){return+(e=e.replace(/rem/g,""))*function(){if(!me){const e=document.documentElement,t=e.style.fontSize||window.getComputedStyle(e).fontSize;me=parseFloat(t)}return me}()}function he(e){if("number"==typeof e)return e;if(n){if(e.includes("rem"))return fe(e);if(e.includes("vw"))return function(e){return+(e=e.replace(/vw/g,""))*se.value/100}(e);if(e.includes("vh"))return function(e){return+(e=e.replace(/vh/g,""))*ce.value/100}(e)}return parseFloat(e)}const ge=/-(\w)/g,be=e=>e.replace(ge,(e,t)=>t.toUpperCase());function ye(e,t=2){let o=e+"";for(;o.length<t;)o="0"+o;return o}const we=(e,t,o)=>Math.min(Math.max(e,t),o);function xe(e,t,o){const a=e.indexOf(t);return-1===a?e:"-"===t&&0!==a?e.slice(0,a):e.slice(0,a+1)+e.slice(a).replace(o,"")}function Ve(e,t=!0,o=!0){e=t?xe(e,".",/\./g):e.split(".")[0];const a=t?/[^-0-9.]/g:/[^-0-9]/g;return(e=o?xe(e,"-",/-/g):e.replace(/-/,"")).replace(a,"")}function Ne(e,t){const o=10**10;return Math.round((e+t)*o)/o}const{hasOwnProperty:Ce}=Object.prototype;function ke(e,t){return Object.keys(t).forEach(o=>{!function(e,t,o){const a=t[o];l(a)&&(Ce.call(e,o)&&r(a)?e[o]=ke(Object(e[o]),a):e[o]=a)}(e,t,o)}),e}const Se=t.ref("zh-CN"),Te=t.reactive({"zh-CN":{name:"姓名",tel:"电话",save:"保存",clear:"清空",cancel:"取消",confirm:"确认",delete:"删除",loading:"加载中...",noCoupon:"暂无优惠券",nameEmpty:"请填写姓名",addContact:"添加联系人",telInvalid:"请填写正确的电话",vanCalendar:{end:"结束",start:"开始",title:"日期选择",weekdays:["日","一","二","三","四","五","六"],monthTitle:(e,t)=>`${e}年${t}月`,rangePrompt:e=>`最多选择 ${e} 天`},vanCascader:{select:"请选择"},vanPagination:{prev:"上一页",next:"下一页"},vanPullRefresh:{pulling:"下拉即可刷新...",loosing:"释放即可刷新..."},vanSubmitBar:{label:"合计:"},vanCoupon:{unlimited:"无门槛",discount:e=>`${e}折`,condition:e=>`满${e}元可用`},vanCouponCell:{title:"优惠券",count:e=>`${e}张可用`},vanCouponList:{exchange:"兑换",close:"不使用",enable:"可用",disabled:"不可用",placeholder:"输入优惠码"},vanAddressEdit:{area:"地区",areaEmpty:"请选择地区",addressEmpty:"请填写详细地址",addressDetail:"详细地址",defaultAddress:"设为默认收货地址"},vanAddressList:{add:"新增地址"}}}),Be={messages:()=>Te[Se.value],use(e,t){Se.value=e,this.add({[e]:t})},add(e={}){ke(Te,e)}};var Pe=Be;function De(e){const t=be(e)+".";return(e,...o)=>{const a=Pe.messages(),n=p(a,t+e)||p(a,e);return i(n)?n(...o):n}}function Oe(e,t){return t?"string"==typeof t?` ${e}--${t}`:Array.isArray(t)?t.reduce((t,o)=>t+Oe(e,o),""):Object.keys(t).reduce((o,a)=>o+(t[a]?Oe(e,a):""),""):""}function Ae(e){return(t,o)=>(t&&"string"!=typeof t&&(o=t,t=""),`${t=t?`${e}__${t}`:e}${Oe(t,o)}`)}function Ie(e){const t=`van-${e}`;return[t,Ae(t),De(t)]}const ze="van-hairline",Ee=`${ze}--top`,$e=`${ze}--left`,Le=`${ze}--right`,Me=`${ze}--bottom`,Fe=`${ze}--surround`,Re=`${ze}--top-bottom`,He=`${ze}-unset--top-bottom`,je="van-haptics-feedback",We=Symbol("van-form");function Ue(e,{args:t=[],done:a,canceled:n,error:r}){if(e){const l=e.apply(null,t);s(l)?l.then(e=>{e?a():n&&n()}).catch(r||o):l?a():n&&n()}else a()}function Ye(e){return e.install=t=>{const{name:o}=e;o&&(t.component(o,e),t.component(be(`-${o}`),e))},e}function Xe(e,t){return e.reduce((e,o)=>Math.abs(e-t)<Math.abs(o-t)?e:o)}const qe=Symbol();function Ge(e){const o=t.inject(qe,null);o&&t.watch(o,t=>{t&&e()})}const Ze=(e,o)=>{const a=t.ref(),n=()=>{a.value=P(e).height};return t.onMounted(()=>{if(t.nextTick(n),o)for(let e=1;e<=3;e++)setTimeout(n,100*e)}),Ge(()=>t.nextTick(n)),t.watch([se,ce],n),a};function Ke(e,o){const a=Ze(e,!0);return e=>t.createVNode("div",{class:o("placeholder"),style:{height:a.value?`${a.value}px`:void 0}},[e()])}const[_e,Je]=Ie("action-bar"),Qe=Symbol(_e),et={placeholder:Boolean,safeAreaInsetBottom:b};const tt=Ye(t.defineComponent({name:_e,props:et,setup(e,{slots:o}){const a=t.ref(),n=Ke(a,Je),{linkChildren:r}=I(Qe);r();const l=()=>{var n;return t.createVNode("div",{ref:a,class:[Je(),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[null==(n=o.default)?void 0:n.call(o)])};return()=>e.placeholder?n(l):l()}}));function ot(e){const o=t.getCurrentInstance();o&&a(o.proxy,e)}const at={to:[String,Object],url:String,replace:Boolean};function nt({to:e,url:t,replace:o,$router:a}){e&&a?a[o?"replace":"push"](e):t&&(o?location.replace(t):location.href=t)}function rt(){const e=t.getCurrentInstance().proxy;return()=>nt(e)}const[lt,it]=Ie("badge"),st={dot:Boolean,max:g,tag:N("div"),color:String,offset:Array,content:g,showZero:b,position:N("top-right")};const ct=Ye(t.defineComponent({name:lt,props:st,setup(e,{slots:o}){const a=()=>{if(o.content)return!0;const{content:t,showZero:a}=e;return l(t)&&""!==t&&(a||0!==t&&"0"!==t)},n=()=>{const{dot:t,max:n,content:r}=e;if(!t&&a())return o.content?o.content():l(n)&&u(r)&&+r>+n?`${n}+`:r},r=e=>e.startsWith("-")?e.replace("-",""):`-${e}`,i=t.computed(()=>{const t={background:e.color};if(e.offset){const[a,n]=e.offset,{position:l}=e,[i,s]=l.split("-");o.default?(t[i]="number"==typeof n?ue("top"===i?n:-n):"top"===i?ue(n):r(n),t[s]="number"==typeof a?ue("left"===s?a:-a):"left"===s?ue(a):r(a)):(t.marginTop=ue(n),t.marginLeft=ue(a))}return t}),s=()=>{if(a()||e.dot)return t.createVNode("div",{class:it([e.position,{dot:e.dot,fixed:!!o.default}]),style:i.value},[n()])};return()=>{if(o.default){const{tag:a}=e;return t.createVNode(a,{class:it("wrapper")},{default:()=>[o.default(),s()]})}return s()}}}));let dt=2e3;const[ut,pt]=Ie("config-provider"),vt=Symbol(ut),mt={tag:N("div"),theme:N("light"),zIndex:Number,themeVars:Object,themeVarsDark:Object,themeVarsLight:Object,themeVarsScope:N("local"),iconPrefix:String};function ft(e={},t={}){Object.keys(e).forEach(o=>{e[o]!==t[o]&&document.documentElement.style.setProperty(o,e[o])}),Object.keys(t).forEach(t=>{e[t]||document.documentElement.style.removeProperty(t)})}var ht=t.defineComponent({name:ut,props:mt,setup(e,{slots:o}){const r=t.computed(()=>function(e){const t={};return Object.keys(e).forEach(o=>{const a=o.replace(/([A-Z])/g,"-$1").toLowerCase().replace(/^-/,"").replace(/([a-zA-Z])(\d)/g,"$1-$2");t[`--van-${a}`]=e[o]}),t}(a({},e.themeVars,"dark"===e.theme?e.themeVarsDark:e.themeVarsLight)));if(n){const o=()=>{document.documentElement.classList.add(`van-theme-${e.theme}`)},a=(t=e.theme)=>{document.documentElement.classList.remove(`van-theme-${t}`)};t.watch(()=>e.theme,(e,t)=>{t&&a(t),o()},{immediate:!0}),t.onActivated(o),t.onDeactivated(a),t.onBeforeUnmount(a),t.watch(r,(t,o)=>{"global"===e.themeVarsScope&&ft(t,o)}),t.watch(()=>e.themeVarsScope,(e,t)=>{"global"===t&&ft({},r.value),"global"===e&&ft(r.value,{})}),"global"===e.themeVarsScope&&ft(r.value,{})}return t.provide(vt,e),t.watchEffect(()=>{var t;void 0!==e.zIndex&&(t=e.zIndex,dt=t)}),()=>t.createVNode(e.tag,{class:pt(),style:"local"===e.themeVarsScope?r.value:void 0},{default:()=>{var e;return[null==(e=o.default)?void 0:e.call(o)]}})}});const[gt,bt]=Ie("icon"),yt={dot:Boolean,tag:N("i"),name:String,size:g,badge:g,color:String,badgeProps:Object,classPrefix:String};const wt=Ye(t.defineComponent({name:gt,props:yt,setup(e,{slots:o}){const a=t.inject(vt,null),n=t.computed(()=>e.classPrefix||(null==a?void 0:a.iconPrefix)||bt());return()=>{const{tag:a,dot:r,name:l,size:i,badge:s,color:c}=e,d=(e=>null==e?void 0:e.includes("/"))(l);return t.createVNode(ct,t.mergeProps({dot:r,tag:a,class:[n.value,d?"":`${n.value}-${l}`],style:{color:c,fontSize:ue(i)},content:s},e.badgeProps),{default:()=>{var e;return[null==(e=o.default)?void 0:e.call(o),d&&t.createVNode("img",{class:bt("image"),src:l},null)]}})}}}));var xt=wt;const[Vt,Nt]=Ie("loading"),Ct=Array(12).fill(null).map((e,o)=>t.createVNode("i",{class:Nt("line",String(o+1))},null)),kt=t.createVNode("svg",{class:Nt("circular"),viewBox:"25 25 50 50"},[t.createVNode("circle",{cx:"50",cy:"50",r:"20",fill:"none"},null)]),St={size:g,type:N("circular"),color:String,vertical:Boolean,textSize:g,textColor:String};const Tt=Ye(t.defineComponent({name:Vt,props:St,setup(e,{slots:o}){const n=t.computed(()=>a({color:e.color},pe(e.size))),r=()=>{const a="spinner"===e.type?Ct:kt;return t.createVNode("span",{class:Nt("spinner",e.type),style:n.value},[o.icon?o.icon():a])},l=()=>{var a;if(o.default)return t.createVNode("span",{class:Nt("text"),style:{fontSize:ue(e.textSize),color:null!=(a=e.textColor)?a:e.color}},[o.default()])};return()=>{const{type:o,vertical:a}=e;return t.createVNode("div",{class:Nt([o,{vertical:a}]),"aria-live":"polite","aria-busy":!0},[r(),l()])}}})),[Bt,Pt]=Ie("button"),Dt=a({},at,{tag:N("button"),text:String,icon:String,type:N("default"),size:N("normal"),color:String,block:Boolean,plain:Boolean,round:Boolean,square:Boolean,loading:Boolean,hairline:Boolean,disabled:Boolean,iconPrefix:String,nativeType:N("button"),loadingSize:g,loadingText:String,loadingType:String,iconPosition:N("left")});const Ot=Ye(t.defineComponent({name:Bt,props:Dt,emits:["click"],setup(e,{emit:o,slots:a}){const n=rt(),r=()=>e.loading?a.loading?a.loading():t.createVNode(Tt,{size:e.loadingSize,type:e.loadingType,class:Pt("loading")},null):a.icon?t.createVNode("div",{class:Pt("icon")},[a.icon()]):e.icon?t.createVNode(wt,{name:e.icon,class:Pt("icon"),classPrefix:e.iconPrefix},null):void 0,l=()=>{let o;if(o=e.loading?e.loadingText:a.default?a.default():e.text,o)return t.createVNode("span",{class:Pt("text")},[o])},i=()=>{const{color:t,plain:o}=e;if(t){const e={color:o?t:"white"};return o||(e.background=t),t.includes("gradient")?e.border=0:e.borderColor=t,e}},s=t=>{e.loading?le(t):e.disabled||(o("click",t),n())};return()=>{const{tag:o,type:a,size:n,block:c,round:d,plain:u,square:p,loading:v,disabled:m,hairline:f,nativeType:h,iconPosition:g}=e,b=[Pt([a,n,{plain:u,block:c,round:d,square:p,loading:v,disabled:m,hairline:f}]),{[Fe]:f}];return t.createVNode(o,{type:h,class:b,style:i(),disabled:m,onClick:s},{default:()=>[t.createVNode("div",{class:Pt("content")},["left"===g&&r(),l(),"right"===g&&r()])]})}}})),[At,It]=Ie("action-bar-button"),zt=a({},at,{type:String,text:String,icon:String,color:String,loading:Boolean,disabled:Boolean});const Et=Ye(t.defineComponent({name:At,props:zt,setup(e,{slots:o}){const a=rt(),{parent:n,index:r}=D(Qe),l=t.computed(()=>{if(n){const e=n.children[r.value-1];return!(e&&"isButton"in e)}}),i=t.computed(()=>{if(n){const e=n.children[r.value+1];return!(e&&"isButton"in e)}});return ot({isButton:!0}),()=>{const{type:n,icon:r,text:s,color:c,loading:d,disabled:u}=e;return t.createVNode(Ot,{class:It([n,{last:i.value,first:l.value}]),size:"large",type:n,icon:r,color:c,loading:d,disabled:u,onClick:a},{default:()=>[o.default?o.default():s]})}}})),[$t,Lt]=Ie("action-bar-icon"),Mt=a({},at,{dot:Boolean,text:String,icon:String,color:String,badge:g,iconClass:h,badgeProps:Object,iconPrefix:String});const Ft=Ye(t.defineComponent({name:$t,props:Mt,setup(e,{slots:o}){const a=rt();D(Qe);const n=()=>{const{dot:a,badge:n,icon:r,color:l,iconClass:i,badgeProps:s,iconPrefix:c}=e;return o.icon?t.createVNode(ct,t.mergeProps({dot:a,class:Lt("icon"),content:n},s),{default:o.icon}):t.createVNode(wt,{tag:"div",dot:a,name:r,badge:n,color:l,class:[Lt("icon"),i],badgeProps:s,classPrefix:c},null)};return()=>t.createVNode("div",{role:"button",class:Lt(),tabindex:0,onClick:a},[n(),o.default?o.default():e.text])}})),Rt={show:Boolean,zIndex:g,overlay:b,duration:g,teleport:[String,Object],lockScroll:b,lazyRender:b,beforeClose:Function,overlayProps:Object,overlayStyle:Object,overlayClass:h,transitionAppear:Boolean,closeOnClickOverlay:b},Ht=Object.keys(Rt);function jt(){const e=t.ref(0),o=t.ref(0),a=t.ref(0),n=t.ref(0),r=t.ref(0),l=t.ref(0),i=t.ref(""),s=t.ref(!0),c=()=>{a.value=0,n.value=0,r.value=0,l.value=0,i.value="",s.value=!0};return{move:t=>{const c=t.touches[0];a.value=(c.clientX<0?0:c.clientX)-e.value,n.value=c.clientY-o.value,r.value=Math.abs(a.value),l.value=Math.abs(n.value);var d,u;(!i.value||r.value<10&&l.value<10)&&(i.value=(d=r.value,u=l.value,d>u?"horizontal":u>d?"vertical":"")),s.value&&(r.value>5||l.value>5)&&(s.value=!1)},start:t=>{c(),e.value=t.touches[0].clientX,o.value=t.touches[0].clientY},reset:c,startX:e,startY:o,deltaX:a,deltaY:n,offsetX:r,offsetY:l,direction:i,isVertical:()=>"vertical"===i.value,isHorizontal:()=>"horizontal"===i.value,isTap:s}}let Wt=0;const Ut="van-overflow-hidden";function Yt(e,o){const a=jt(),n=t=>{a.move(t);const o=a.deltaY.value>0?"10":"01",n=q(t.target,e.value),{scrollHeight:r,offsetHeight:l,scrollTop:i}=n;let s="11";0===i?s=l>=r?"00":"01":i+l>=r&&(s="10"),"11"===s||!a.isVertical()||parseInt(s,2)&parseInt(o,2)||le(t,!0)},r=()=>{document.addEventListener("touchstart",a.start),document.addEventListener("touchmove",n,{passive:!1}),Wt||document.body.classList.add(Ut),Wt++},l=()=>{Wt&&(document.removeEventListener("touchstart",a.start),document.removeEventListener("touchmove",n),Wt--,Wt||document.body.classList.remove(Ut))},i=()=>o()&&l();F(()=>o()&&r()),t.onDeactivated(i),t.onBeforeUnmount(i),t.watch(o,e=>{e?r():l()})}function Xt(e){const o=t.ref(!1);return t.watch(e,e=>{e&&(o.value=e)},{immediate:!0}),e=>()=>o.value?e():null}const qt=()=>{var e;const{scopeId:o}=(null==(e=t.getCurrentInstance())?void 0:e.vnode)||{};return o?{[o]:""}:null},[Gt,Zt]=Ie("overlay"),Kt={show:Boolean,zIndex:g,duration:g,className:h,lockScroll:b,lazyRender:b,customStyle:Object,teleport:[String,Object]};const _t=Ye(t.defineComponent({name:Gt,inheritAttrs:!1,props:Kt,setup(e,{attrs:o,slots:n}){const r=t.ref(),i=Xt(()=>e.show||!e.lazyRender)(()=>{var i;const s=a(ve(e.zIndex),e.customStyle);return l(e.duration)&&(s.animationDuration=`${e.duration}s`),t.withDirectives(t.createVNode("div",t.mergeProps({ref:r,style:s,class:[Zt(),e.className]},o),[null==(i=n.default)?void 0:i.call(n)]),[[t.vShow,e.show]])});return R("touchmove",t=>{e.lockScroll&&le(t,!0)},{target:r}),()=>{const o=t.createVNode(t.Transition,{name:"van-fade",appear:!0},{default:i});return e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[o]}):o}}})),Jt=a({},Rt,{round:Boolean,position:N("center"),closeIcon:N("cross"),closeable:Boolean,transition:String,iconPrefix:String,closeOnPopstate:Boolean,closeIconPosition:N("top-right"),destroyOnClose:Boolean,safeAreaInsetTop:Boolean,safeAreaInsetBottom:Boolean}),[Qt,eo]=Ie("popup");const to=Ye(t.defineComponent({name:Qt,inheritAttrs:!1,props:Jt,emits:["open","close","opened","closed","keydown","update:show","clickOverlay","clickCloseIcon"],setup(e,{emit:o,attrs:n,slots:r}){let i,s;const c=t.ref(),d=t.ref(),u=Xt(()=>e.show||!e.lazyRender),p=t.computed(()=>{const t={zIndex:c.value};if(l(e.duration)){t["center"===e.position?"animationDuration":"transitionDuration"]=`${e.duration}s`}return t}),v=()=>{i||(i=!0,c.value=void 0!==e.zIndex?+e.zIndex:++dt,o("open"))},m=()=>{i&&Ue(e.beforeClose,{done(){i=!1,o("close"),o("update:show",!1)}})},f=t=>{o("clickOverlay",t),e.closeOnClickOverlay&&m()},h=()=>{if(e.overlay){const o=a({show:e.show,class:e.overlayClass,zIndex:c.value,duration:e.duration,customStyle:e.overlayStyle,role:e.closeOnClickOverlay?"button":void 0,tabindex:e.closeOnClickOverlay?0:void 0},e.overlayProps);return t.createVNode(_t,t.mergeProps(o,qt(),{onClick:f}),{default:r["overlay-content"]})}},g=e=>{o("clickCloseIcon",e),m()},b=()=>{if(e.closeable)return t.createVNode(wt,{role:"button",tabindex:0,name:e.closeIcon,class:[eo("close-icon",e.closeIconPosition),je],classPrefix:e.iconPrefix,onClick:g},null)};let y;const w=()=>{y&&clearTimeout(y),y=setTimeout(()=>{o("opened")})},x=()=>o("closed"),V=e=>o("keydown",e),N=u(()=>{var o;const{destroyOnClose:a,round:l,position:i,safeAreaInsetTop:s,safeAreaInsetBottom:c,show:u}=e;if(u||!a)return t.withDirectives(t.createVNode("div",t.mergeProps({ref:d,style:p.value,role:"dialog",tabindex:0,class:[eo({round:l,[i]:i}),{"van-safe-area-top":s,"van-safe-area-bottom":c}],onKeydown:V},n,qt()),[null==(o=r.default)?void 0:o.call(r),b()]),[[t.vShow,u]])}),C=()=>{const{position:o,transition:a,transitionAppear:n}=e,r="center"===o?"van-fade":`van-popup-slide-${o}`;return t.createVNode(t.Transition,{name:a||r,appear:n,onAfterEnter:w,onAfterLeave:x},{default:N})};return t.watch(()=>e.show,e=>{e&&!i&&(v(),0===n.tabindex&&t.nextTick(()=>{var e;null==(e=d.value)||e.focus()})),!e&&i&&(i=!1,o("close"))}),ot({popupRef:d}),Yt(d,()=>e.show&&e.lockScroll),R("popstate",()=>{e.closeOnPopstate&&(m(),s=!1)}),t.onMounted(()=>{e.show&&v()}),t.onActivated(()=>{s&&(o("update:show",!0),s=!1)}),t.onDeactivated(()=>{e.show&&e.teleport&&(m(),s=!0)}),t.provide(qe,()=>e.show),()=>e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[h(),C()]}):t.createVNode(t.Fragment,null,[h(),C()])}})),[oo,ao]=Ie("action-sheet"),no=a({},Rt,{title:String,round:b,actions:w(),closeIcon:N("cross"),closeable:b,cancelText:String,description:String,closeOnPopstate:b,closeOnClickAction:Boolean,safeAreaInsetBottom:b}),ro=[...Ht,"round","closeOnPopstate","safeAreaInsetBottom"];const lo=Ye(t.defineComponent({name:oo,props:no,emits:["select","cancel","update:show"],setup(e,{slots:o,emit:a}){const n=e=>a("update:show",e),r=()=>{n(!1),a("cancel")},l=()=>{if(e.title)return t.createVNode("div",{class:ao("header")},[e.title,e.closeable&&t.createVNode(wt,{name:e.closeIcon,class:[ao("close"),je],onClick:r},null)])},i=()=>{if(o.cancel||e.cancelText)return[t.createVNode("div",{class:ao("gap")},null),t.createVNode("button",{type:"button",class:ao("cancel"),onClick:r},[o.cancel?o.cancel():e.cancelText])]},s=e=>{if(e.icon)return t.createVNode(wt,{class:ao("item-icon"),name:e.icon},null)},c=(e,a)=>e.loading?t.createVNode(Tt,{class:ao("loading-icon")},null):o.action?o.action({action:e,index:a}):[t.createVNode("span",{class:ao("name")},[e.name]),e.subname&&t.createVNode("div",{class:ao("subname")},[e.subname])],d=(o,r)=>{const{color:l,loading:i,callback:d,disabled:u,className:p}=o;return t.createVNode("button",{type:"button",style:{color:l},class:[ao("item",{loading:i,disabled:u}),p],onClick:()=>{u||i||(d&&d(o),e.closeOnClickAction&&n(!1),t.nextTick(()=>a("select",o,r)))}},[s(o),c(o,r)])},u=()=>{if(e.description||o.description){const a=o.description?o.description():e.description;return t.createVNode("div",{class:ao("description")},[a])}};return()=>t.createVNode(to,t.mergeProps({class:ao(),position:"bottom","onUpdate:show":n},v(e,ro)),{default:()=>{var a;return[l(),u(),t.createVNode("div",{class:ao("content")},[e.actions.map(d),null==(a=o.default)?void 0:a.call(o)]),i()]}})}})),[io,so,co]=Ie("picker"),uo=e=>e.find(e=>!e.disabled)||e[0];function po(e,t){for(let o=t=we(t,0,e.length);o<e.length;o++)if(!e[o].disabled)return o;for(let o=t-1;o>=0;o--)if(!e[o].disabled)return o;return 0}const vo=(e,t,o)=>void 0!==t&&e.some(e=>e[o.value]===t);function mo(e,t,o){const a=e.findIndex(e=>e[o.value]===t);return e[po(e,a)]}const[fo,ho]=Ie("picker-column"),go=Symbol(fo);var bo=t.defineComponent({name:fo,props:{value:g,fields:y(Object),options:w(),readonly:Boolean,allowHtml:Boolean,optionHeight:y(Number),swipeDuration:y(g),visibleOptionNum:y(g)},emits:["change","clickOption","scrollInto"],setup(e,{emit:o,slots:a}){let n,r,l,i,s;const c=t.ref(),d=t.ref(),u=t.ref(0),p=t.ref(0),v=jt(),m=()=>e.options.length,f=()=>e.optionHeight*(+e.visibleOptionNum-1)/2,h=t=>{let a=po(e.options,t);const r=-a*e.optionHeight,l=()=>{a>m()-1&&(a=po(e.options,t));const n=e.options[a][e.fields.value];n!==e.value&&o("change",n)};n&&r!==u.value?s=l:l(),u.value=r},g=()=>e.readonly||!e.options.length,b=t=>we(Math.round(-t/e.optionHeight),0,m()-1),y=t.computed(()=>b(u.value)),w=()=>{n=!1,p.value=0,s&&(s(),s=null)},x=e=>{if(!g()){if(v.start(e),n){const e=function(e){const{transform:t}=window.getComputedStyle(e),o=t.slice(7,t.length-1).split(", ")[5];return Number(o)}(d.value);u.value=Math.min(0,e-f())}p.value=0,r=u.value,l=Date.now(),i=r,s=null}},V=()=>{if(g())return;const t=u.value-i,o=Date.now()-l;if(o<300&&Math.abs(t)>15)return void((t,o)=>{const a=Math.abs(t/o);t=u.value+a/.003*(t<0?-1:1);const n=b(t);p.value=+e.swipeDuration,h(n)})(t,o);const a=b(u.value);p.value=200,h(a),setTimeout(()=>{n=!1},0)},N=()=>{const r={height:`${e.optionHeight}px`};return e.options.map((l,i)=>{const c=l[e.fields.text],{disabled:d}=l,u=l[e.fields.value],v={role:"button",style:r,tabindex:d?-1:0,class:[ho("item",{disabled:d,selected:u===e.value}),l.className],onClick:()=>(t=>{n||g()||(s=null,p.value=200,h(t),o("clickOption",e.options[t]))})(i)},m={class:"van-ellipsis",[e.allowHtml?"innerHTML":"textContent"]:c};return t.createVNode("li",v,[a.option?a.option(l,i):t.createVNode("div",m,null)])})};return D(go),ot({stopMomentum:w}),t.watchEffect(()=>{const t=n?Math.floor(-u.value/e.optionHeight):e.options.findIndex(t=>t[e.fields.value]===e.value),o=po(e.options,t),a=-o*e.optionHeight;n&&o<t&&w(),u.value=a}),R("touchmove",t=>{if(g())return;v.move(t),v.isVertical()&&(n=!0,le(t,!0));const a=we(r+v.deltaY.value,-m()*e.optionHeight,e.optionHeight),s=b(a);s!==y.value&&o("scrollInto",e.options[s]),u.value=a;const c=Date.now();c-l>300&&(l=c,i=a)},{target:c}),()=>t.createVNode("div",{ref:c,class:ho(),onTouchstartPassive:x,onTouchend:V,onTouchcancel:V},[t.createVNode("ul",{ref:d,style:{transform:`translate3d(0, ${u.value+f()}px, 0)`,transitionDuration:`${p.value}ms`,transitionProperty:p.value?"all":"none"},class:ho("wrapper"),onTransitionend:w},[N()])])}});const[yo]=Ie("picker-toolbar"),wo={title:String,cancelButtonText:String,confirmButtonText:String},xo=["cancel","confirm","title","toolbar"],Vo=Object.keys(wo);var No=t.defineComponent({name:yo,props:wo,emits:["confirm","cancel"],setup(e,{emit:o,slots:a}){const n=()=>o("cancel"),r=()=>o("confirm"),l=()=>{var o;const r=null!=(o=e.cancelButtonText)?o:co("cancel");if(a.cancel||r)return t.createVNode("button",{type:"button",class:[so("cancel"),je],onClick:n},[a.cancel?a.cancel():r])},i=()=>{var o;const n=null!=(o=e.confirmButtonText)?o:co("confirm");if(a.confirm||n)return t.createVNode("button",{type:"button",class:[so("confirm"),je],onClick:r},[a.confirm?a.confirm():n])};return()=>t.createVNode("div",{class:so("toolbar")},[a.toolbar?a.toolbar():[l(),a.title?a.title():e.title?t.createVNode("div",{class:[so("title"),"van-ellipsis"]},[e.title]):void 0,i()]])}});const Co=(e,o)=>{const a=t.ref(e());return t.watch(e,e=>{e!==a.value&&(a.value=e)}),t.watch(a,t=>{t!==e()&&o(t)}),a},ko=Array.isArray,So=e=>"string"==typeof e,To=e=>null!==e&&"object"==typeof e,Bo=/\B([A-Z])/g,Po=(e=>{const t=Object.create(null);return o=>t[o]||(t[o]=e(o))})(e=>e.replace(Bo,"-$1").toLowerCase());
/**
  * @vue/shared v3.5.17
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/function Do(e){if(ko(e)){const t={};for(let o=0;o<e.length;o++){const a=e[o],n=So(a)?zo(a):Do(a);if(n)for(const e in n)t[e]=n[e]}return t}if(So(e)||To(e))return e}const Oo=/;(?![^(]*\))/g,Ao=/:([^]+)/,Io=/\/\*[^]*?\*\//g;function zo(e){const t={};return e.replace(Io,"").split(Oo).forEach(e=>{if(e){const o=e.split(Ao);o.length>1&&(t[o[0].trim()]=o[1].trim())}}),t}function Eo(e){let t="";if(So(e))t=e;else if(ko(e))for(let o=0;o<e.length;o++){const a=Eo(e[o]);a&&(t+=a+" ")}else if(To(e))for(const o in e)e[o]&&(t+=o+" ");return t.trim()}let $o=0;function Lo(){const e=t.getCurrentInstance(),{name:o="unknown"}=(null==e?void 0:e.type)||{};return`${o}-${++$o}`}function Mo(){const e=t.ref([]),o=[];t.onBeforeUpdate(()=>{e.value=[]});return[e,t=>(o[t]||(o[t]=o=>{e.value[t]=o}),o[t])]}function Fo(e,o){if(!n||!window.IntersectionObserver)return;const a=new IntersectionObserver(e=>{o(e[0].intersectionRatio>0)},{root:document.body}),r=()=>{e.value&&a.unobserve(e.value)};t.onDeactivated(r),t.onBeforeUnmount(r),F(()=>{e.value&&a.observe(e.value)})}const[Ro,Ho]=Ie("sticky"),jo={zIndex:g,position:N("top"),container:Object,offsetTop:V(0),offsetBottom:V(0)};const Wo=Ye(t.defineComponent({name:Ro,props:jo,emits:["scroll","change"],setup(e,{emit:o,slots:n}){const r=t.ref(),l=G(r),i=t.reactive({fixed:!1,width:0,height:0,transform:0}),s=t.ref(!1),c=t.computed(()=>he("top"===e.position?e.offsetTop:e.offsetBottom)),d=t.computed(()=>{if(s.value)return;const{fixed:e,height:t,width:o}=i;return e?{width:`${o}px`,height:`${t}px`}:void 0}),u=t.computed(()=>{if(!i.fixed||s.value)return;const t=a(ve(e.zIndex),{width:`${i.width}px`,height:`${i.height}px`,[e.position]:`${c.value}px`});return i.transform&&(t.transform=`translate3d(0, ${i.transform}px, 0)`),t}),p=()=>{if(!r.value||ie(r))return;const{container:t,position:a}=e,n=P(r),l=J(window);if(i.width=n.width,i.height=n.height,"top"===a)if(t){const e=P(t),o=e.bottom-c.value-i.height;i.fixed=c.value>n.top&&e.bottom>0,i.transform=o<0?o:0}else i.fixed=c.value>n.top;else{const{clientHeight:e}=document.documentElement;if(t){const o=P(t),a=e-o.top-c.value-i.height;i.fixed=e-c.value<n.bottom&&e>o.top,i.transform=a<0?-a:0}else i.fixed=e-c.value<n.bottom}(e=>{o("scroll",{scrollTop:e,isFixed:i.fixed})})(l)};return t.watch(()=>i.fixed,e=>o("change",e)),R("scroll",p,{target:l,passive:!0}),Fo(r,p),t.watch([se,ce],()=>{r.value&&!ie(r)&&i.fixed&&(s.value=!0,t.nextTick(()=>{const e=P(r);i.width=e.width,i.height=e.height,s.value=!1}))}),()=>{var e;return t.createVNode("div",{ref:r,style:d.value},[t.createVNode("div",{class:Ho({fixed:i.fixed&&!s.value}),style:u.value},[null==(e=n.default)?void 0:e.call(n)])])}}})),[Uo,Yo]=Ie("swipe"),Xo={loop:b,width:g,height:g,vertical:Boolean,autoplay:V(0),duration:V(500),touchable:b,lazyRender:Boolean,initialSwipe:V(0),indicatorColor:String,showIndicators:b,stopPropagation:b},qo=Symbol(Uo);const Go=Ye(t.defineComponent({name:Uo,props:Xo,emits:["change","dragStart","dragEnd"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=t.ref(),l=t.reactive({rect:null,width:0,height:0,offset:0,active:0,swiping:!1});let i=!1;const s=jt(),{children:c,linkChildren:d}=I(qo),u=t.computed(()=>c.length),p=t.computed(()=>l[e.vertical?"height":"width"]),v=t.computed(()=>e.vertical?s.deltaY.value:s.deltaX.value),m=t.computed(()=>{if(l.rect){return(e.vertical?l.rect.height:l.rect.width)-p.value*u.value}return 0}),f=t.computed(()=>p.value?Math.ceil(Math.abs(m.value)/p.value):u.value),h=t.computed(()=>u.value*p.value),g=t.computed(()=>(l.active+u.value)%u.value),b=t.computed(()=>{const t=e.vertical?"vertical":"horizontal";return s.direction.value===t}),y=t.computed(()=>{const t={transitionDuration:`${l.swiping?0:e.duration}ms`,transform:`translate${e.vertical?"Y":"X"}(${+l.offset.toFixed(2)}px)`};if(p.value){const o=e.vertical?"height":"width",a=e.vertical?"width":"height";t[o]=`${h.value}px`,t[a]=e[a]?`${e[a]}px`:""}return t}),w=(t,o=0)=>{let a=t*p.value;e.loop||(a=Math.min(a,-m.value));let n=o-a;return e.loop||(n=we(n,m.value,0)),n},x=({pace:t=0,offset:a=0,emitChange:n})=>{if(u.value<=1)return;const{active:r}=l,i=(t=>{const{active:o}=l;return t?e.loop?we(o+t,-1,u.value):we(o+t,0,f.value):o})(t),s=w(i,a);if(e.loop){if(c[0]&&s!==m.value){const e=s<m.value;c[0].setOffset(e?h.value:0)}if(c[u.value-1]&&0!==s){const e=s>0;c[u.value-1].setOffset(e?-h.value:0)}}l.active=i,l.offset=s,n&&i!==r&&o("change",g.value)},V=()=>{l.swiping=!0,l.active<=-1?x({pace:u.value}):l.active>=u.value&&x({pace:-u.value})},N=()=>{V(),s.reset(),T(()=>{l.swiping=!1,x({pace:1,emitChange:!0})})};let k;const S=()=>clearTimeout(k),B=()=>{S(),+e.autoplay>0&&u.value>1&&(k=setTimeout(()=>{N(),B()},+e.autoplay))},P=(o=+e.initialSwipe)=>{if(!n.value)return;const a=()=>{var t,a;if(!ie(n)){const o={width:n.value.offsetWidth,height:n.value.offsetHeight};l.rect=o,l.width=+(null!=(t=e.width)?t:o.width),l.height=+(null!=(a=e.height)?a:o.height)}u.value&&-1===(o=Math.min(u.value-1,o))&&(o=u.value-1),l.active=o,l.swiping=!0,l.offset=w(o),c.forEach(e=>{e.setOffset(0)}),B()};ie(n)?t.nextTick().then(a):a()},D=()=>P(l.active);let O;const A=t=>{!e.touchable||t.touches.length>1||(s.start(t),i=!1,O=Date.now(),S(),V())},z=()=>{if(!e.touchable||!l.swiping)return;const t=Date.now()-O,a=v.value/t;if((Math.abs(a)>.25||Math.abs(v.value)>p.value/2)&&b.value){const t=e.vertical?s.offsetY.value:s.offsetX.value;let o=0;o=e.loop?t>0?v.value>0?-1:1:0:-Math[v.value>0?"ceil":"floor"](v.value/p.value),x({pace:o,emitChange:!0})}else v.value&&x({pace:0});i=!1,l.swiping=!1,o("dragEnd",{index:g.value}),B()},E=(o,a)=>{const n=a===g.value,r=n?{backgroundColor:e.indicatorColor}:void 0;return t.createVNode("i",{style:r,class:Yo("indicator",{active:n})},null)};return ot({prev:()=>{V(),s.reset(),T(()=>{l.swiping=!1,x({pace:-1,emitChange:!0})})},next:N,state:l,resize:D,swipeTo:(t,o={})=>{V(),s.reset(),T(()=>{let a;a=e.loop&&t===u.value?0===l.active?0:t:t%u.value,o.immediate?T(()=>{l.swiping=!1}):l.swiping=!1,x({pace:a-l.active,emitChange:!0})})}}),d({size:p,props:e,count:u,activeIndicator:g}),t.watch(()=>e.initialSwipe,e=>P(+e)),t.watch(u,()=>P(l.active)),t.watch(()=>e.autoplay,B),t.watch([se,ce,()=>e.width,()=>e.height],D),t.watch(function(){if(!Z&&(Z=t.ref("visible"),C)){const e=()=>{Z.value=document.hidden?"hidden":"visible"};e(),window.addEventListener("visibilitychange",e)}return Z}(),e=>{"visible"===e?B():S()}),t.onMounted(P),t.onActivated(()=>P(l.active)),Ge(()=>P(l.active)),t.onDeactivated(S),t.onBeforeUnmount(S),R("touchmove",t=>{if(e.touchable&&l.swiping&&(s.move(t),b.value)){!e.loop&&(0===l.active&&v.value>0||l.active===u.value-1&&v.value<0)||(le(t,e.stopPropagation),x({offset:v.value}),i||(o("dragStart",{index:g.value}),i=!0))}},{target:r}),()=>{var o;return t.createVNode("div",{ref:n,class:Yo()},[t.createVNode("div",{ref:r,style:y.value,class:Yo("track",{vertical:e.vertical}),onTouchstartPassive:A,onTouchend:z,onTouchcancel:z},[null==(o=a.default)?void 0:o.call(a)]),a.indicator?a.indicator({active:g.value,total:u.value}):e.showIndicators&&u.value>1?t.createVNode("div",{class:Yo("indicators",{vertical:e.vertical})},[Array(u.value).fill("").map(E)]):void 0])}}})),[Zo,Ko]=Ie("tabs");var _o=t.defineComponent({name:Zo,props:{count:y(Number),inited:Boolean,animated:Boolean,duration:y(g),swipeable:Boolean,lazyRender:Boolean,currentIndex:y(Number)},emits:["change"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=e=>o("change",e),l=()=>{var o;const l=null==(o=a.default)?void 0:o.call(a);return e.animated||e.swipeable?t.createVNode(Go,{ref:n,loop:!1,class:Ko("track"),duration:1e3*+e.duration,touchable:e.swipeable,lazyRender:e.lazyRender,showIndicators:!1,onChange:r},{default:()=>[l]}):l},i=t=>{const o=n.value;o&&o.state.active!==t&&o.swipeTo(t,{immediate:!e.inited})};return t.watch(()=>e.currentIndex,i),t.onMounted(()=>{i(e.currentIndex)}),ot({swipeRef:n}),()=>t.createVNode("div",{class:Ko("content",{animated:e.animated||e.swipeable})},[l()])}});const[Jo,Qo]=Ie("tabs"),ea={type:N("line"),color:String,border:Boolean,sticky:Boolean,shrink:Boolean,active:V(0),duration:V(.3),animated:Boolean,ellipsis:b,swipeable:Boolean,scrollspy:Boolean,offsetTop:V(0),background:String,lazyRender:b,showHeader:b,lineWidth:g,lineHeight:g,beforeChange:Function,swipeThreshold:V(5),titleActiveColor:String,titleInactiveColor:String},ta=Symbol(Jo);var oa=t.defineComponent({name:Jo,props:ea,emits:["change","scroll","rendered","clickTab","update:active"],setup(e,{emit:o,slots:a}){let n,r,i,s,c;const d=t.ref(),u=t.ref(),p=t.ref(),v=t.ref(),m=Lo(),f=G(d),[h,g]=Mo(),{children:b,linkChildren:y}=I(ta),w=t.reactive({inited:!1,position:"",lineStyle:{},currentIndex:-1}),x=t.computed(()=>b.length>+e.swipeThreshold||!e.ellipsis||e.shrink),V=t.computed(()=>({borderColor:e.color,background:e.background})),N=(e,t)=>{var o;return null!=(o=e.name)?o:t},C=t.computed(()=>{const e=b[w.currentIndex];if(e)return N(e,w.currentIndex)}),T=t.computed(()=>he(e.offsetTop)),B=t.computed(()=>e.sticky?T.value+n:0),D=t=>{const o=u.value,a=h.value;if(!(x.value&&o&&a&&a[w.currentIndex]))return;const n=a[w.currentIndex].$el,r=n.offsetLeft-(o.offsetWidth-n.offsetWidth)/2;s&&s(),s=function(e,t,o){let a,n=0;const r=e.scrollLeft,l=0===o?1:Math.round(1e3*o/16);let i=r;return function o(){i+=(t-r)/l,e.scrollLeft=i,++n<l&&(a=k(o))}(),function(){S(a)}}(o,r,t?0:+e.duration)},O=()=>{const o=w.inited;t.nextTick(()=>{const t=h.value;if(!t||!t[w.currentIndex]||"line"!==e.type||ie(d.value))return;const a=t[w.currentIndex].$el,{lineWidth:n,lineHeight:r}=e,i=a.offsetLeft+a.offsetWidth/2,s={width:ue(n),backgroundColor:e.color,transform:`translateX(${i}px) translateX(-50%)`};if(o&&(s.transitionDuration=`${e.duration}s`),l(r)){const e=ue(r);s.height=e,s.borderRadius=e}w.lineStyle=s})},A=(t,a)=>{const n=(e=>{const t=e<w.currentIndex?-1:1;for(;e>=0&&e<b.length;){if(!b[e].disabled)return e;e+=t}})(t);if(!l(n))return;const r=b[n],s=N(r,n),c=null!==w.currentIndex;w.currentIndex!==n&&(w.currentIndex=n,a||D(),O()),s!==e.active&&(o("update:active",s),c&&o("change",s,r.title)),i&&!e.scrollspy&&te(Math.ceil(oe(d.value)-T.value))},z=(e,t)=>{const o=b.findIndex((t,o)=>N(t,o)===e);A(-1===o?0:o,t)},E=(t=!1)=>{if(e.scrollspy){const o=b[w.currentIndex].$el;if(o&&f.value){const a=oe(o,f.value)-B.value;r=!0,c&&c(),c=function(e,t,o,a){let n,r=J(e);const l=r<t,i=0===o?1:Math.round(1e3*o/16),s=(t-r)/i;return function o(){r+=s,(l&&r>t||!l&&r<t)&&(r=t),Q(e,r),l&&r<t||!l&&r>t?n=k(o):a&&(n=k(a))}(),function(){S(n)}}(f.value,a,t?0:+e.duration,()=>{r=!1})}}},$=(t,a,n)=>{const{title:r,disabled:l}=b[a],i=N(b[a],a);l||(Ue(e.beforeChange,{args:[i],done:()=>{A(a),E()}}),nt(t)),o("clickTab",{name:i,title:r,event:n,disabled:l})},L=e=>{i=e.isFixed,o("scroll",e)},M=()=>{if("line"===e.type&&b.length)return t.createVNode("div",{class:Qo("line"),style:w.lineStyle},null)},H=()=>{var o,n,r;const{type:l,border:i,sticky:s}=e,c=[t.createVNode("div",{ref:s?void 0:p,class:[Qo("wrap"),{[Re]:"line"===l&&i}]},[t.createVNode("div",{ref:u,role:"tablist",class:Qo("nav",[l,{shrink:e.shrink,complete:x.value}]),style:V.value,"aria-orientation":"horizontal"},[null==(o=a["nav-left"])?void 0:o.call(a),b.map(e=>e.renderTitle($)),M(),null==(n=a["nav-right"])?void 0:n.call(a)])]),null==(r=a["nav-bottom"])?void 0:r.call(a)];return s?t.createVNode("div",{ref:p},[c]):c},j=()=>{O(),t.nextTick(()=>{var e,t;D(!0),null==(t=null==(e=v.value)?void 0:e.swipeRef.value)||t.resize()})};t.watch(()=>[e.color,e.duration,e.lineWidth,e.lineHeight],O),t.watch(se,j),t.watch(()=>e.active,e=>{e!==C.value&&z(e)}),t.watch(()=>b.length,()=>{w.inited&&(z(e.active),O(),t.nextTick(()=>{D(!0)}))});return ot({resize:j,scrollTo:e=>{t.nextTick(()=>{z(e),E(!0)})}}),t.onActivated(O),Ge(O),F(()=>{z(e.active,!0),t.nextTick(()=>{w.inited=!0,p.value&&(n=P(p.value).height),D(!0)})}),Fo(d,O),R("scroll",()=>{if(e.scrollspy&&!r){const e=(()=>{for(let e=0;e<b.length;e++){const{top:t}=P(b[e].$el);if(t>B.value)return 0===e?0:e-1}return b.length-1})();A(e)}},{target:f,passive:!0}),y({id:m,props:e,setLine:O,scrollable:x,onRendered:(e,t)=>o("rendered",e,t),currentName:C,setTitleRefs:g,scrollIntoView:D}),()=>t.createVNode("div",{ref:d,class:Qo([e.type])},[e.showHeader?e.sticky?t.createVNode(Wo,{container:d.value,offsetTop:T.value,onScroll:L},{default:()=>[H()]}):H():null,t.createVNode(_o,{ref:v,count:b.length,inited:w.inited,animated:e.animated,duration:e.duration,swipeable:e.swipeable,lazyRender:e.lazyRender,currentIndex:w.currentIndex,onChange:A},{default:()=>{var e;return[null==(e=a.default)?void 0:e.call(a)]}})])}});const aa=Symbol(),na=Symbol(),ra=()=>t.inject(na,null),[la,ia]=Ie("tab"),sa=t.defineComponent({name:la,props:{id:String,dot:Boolean,type:String,color:String,title:String,badge:g,shrink:Boolean,isActive:Boolean,disabled:Boolean,controls:String,scrollable:Boolean,activeColor:String,inactiveColor:String,showZeroBadge:b},setup(e,{slots:o}){const a=t.computed(()=>{const t={},{type:o,color:a,disabled:n,isActive:r,activeColor:l,inactiveColor:i}=e;a&&"card"===o&&(t.borderColor=a,n||(r?t.backgroundColor=a:t.color=a));const s=r?l:i;return s&&(t.color=s),t}),n=()=>{const a=t.createVNode("span",{class:ia("text",{ellipsis:!e.scrollable})},[o.title?o.title():e.title]);return e.dot||l(e.badge)&&""!==e.badge?t.createVNode(ct,{dot:e.dot,content:e.badge,showZero:e.showZeroBadge},{default:()=>[a]}):a};return()=>t.createVNode("div",{id:e.id,role:"tab",class:[ia([e.type,{grow:e.scrollable&&!e.shrink,shrink:e.shrink,active:e.isActive,disabled:e.disabled}])],style:a.value,tabindex:e.disabled?void 0:e.isActive?0:-1,"aria-selected":e.isActive,"aria-disabled":e.disabled||void 0,"aria-controls":e.controls,"data-allow-mismatch":"attribute"},[n()])}}),[ca,da]=Ie("swipe-item");const ua=Ye(t.defineComponent({name:ca,setup(e,{slots:o}){let a;const n=t.reactive({offset:0,inited:!1,mounted:!1}),{parent:r,index:l}=D(qo);if(!r)return;const i=t.computed(()=>{const e={},{vertical:t}=r.props;return r.size.value&&(e[t?"height":"width"]=`${r.size.value}px`),n.offset&&(e.transform=`translate${t?"Y":"X"}(${n.offset}px)`),e}),s=t.computed(()=>{const{loop:e,lazyRender:t}=r.props;if(!t||a)return!0;if(!n.mounted)return!1;const o=r.activeIndicator.value,i=r.count.value-1,s=0===o&&e?i:o-1,c=o===i&&e?0:o+1;return a=l.value===o||l.value===s||l.value===c,a});return t.onMounted(()=>{t.nextTick(()=>{n.mounted=!0})}),ot({setOffset:e=>{n.offset=e}}),()=>{var e;return t.createVNode("div",{class:da(),style:i.value},[s.value?null==(e=o.default)?void 0:e.call(o):null])}}})),[pa,va]=Ie("tab"),ma=a({},at,{dot:Boolean,name:g,badge:g,title:String,disabled:Boolean,titleClass:h,titleStyle:[String,Object],showZeroBadge:b});const fa=Ye(t.defineComponent({name:pa,props:ma,setup(e,{slots:o}){const a=Lo(),n=t.ref(!1),r=t.getCurrentInstance(),{parent:l,index:i}=D(ta);if(!l)return;const s=()=>{var t;return null!=(t=e.name)?t:i.value},c=t.computed(()=>{const o=s()===l.currentName.value;return o&&!n.value&&(n.value=!0,l.props.lazyRender&&t.nextTick(()=>{l.onRendered(s(),e.title)})),o}),d=t.ref(""),u=t.ref("");t.watchEffect(()=>{const{titleClass:t,titleStyle:o}=e;d.value=t?Eo(t):"",u.value=o&&"string"!=typeof o?function(e){if(!e)return"";if(So(e))return e;let t="";for(const o in e){const a=e[o];(So(a)||"number"==typeof a)&&(t+=`${o.startsWith("--")?o:Po(o)}:${a};`)}return t}(Do(o)):o});const p=t.ref(!c.value);return t.watch(c,e=>{e?p.value=!1:T(()=>{p.value=!0})}),t.watch(()=>e.title,()=>{l.setLine(),l.scrollIntoView()}),(e=>{const o=ra();t.provide(aa,e),t.provide(na,t.computed(()=>(null==o||o.value)&&e.value))})(c),ot({id:a,renderTitle:n=>t.createVNode(sa,t.mergeProps({key:a,id:`${l.id}-${i.value}`,ref:l.setTitleRefs(i.value),style:u.value,class:d.value,isActive:c.value,controls:a,scrollable:l.scrollable.value,activeColor:l.props.titleActiveColor,inactiveColor:l.props.titleInactiveColor,onClick:e=>n(r.proxy,i.value,e)},v(l.props,["type","color","shrink"]),v(e,["dot","badge","title","disabled","showZeroBadge"])),{title:o.title})}),()=>{var e;const r=`${l.id}-${i.value}`,{animated:s,swipeable:d,scrollspy:u,lazyRender:v}=l.props;if(!o.default&&!s)return;const m=u||c.value;if(s||d)return t.createVNode(ua,{id:a,role:"tabpanel",class:va("panel-wrapper",{inactive:p.value}),tabindex:c.value?0:-1,"aria-hidden":!c.value,"aria-labelledby":r,"data-allow-mismatch":"attribute"},{default:()=>{var e;return[t.createVNode("div",{class:va("panel")},[null==(e=o.default)?void 0:e.call(o)])]}});const f=n.value||u||!v?null==(e=o.default)?void 0:e.call(o):null;return t.withDirectives(t.createVNode("div",{id:a,role:"tabpanel",class:va("panel"),tabindex:m?0:-1,"aria-labelledby":r,"data-allow-mismatch":"attribute"},[f]),[[t.vShow,m]])}}})),ha=Ye(oa),[ga,ba]=Ie("picker-group"),ya=Symbol(ga),wa=a({tabs:w(),activeTab:V(0),nextStepText:String,showToolbar:b},wo);var xa=t.defineComponent({name:ga,props:wa,emits:["confirm","cancel","update:activeTab"],setup(e,{emit:o,slots:a}){const n=Co(()=>e.activeTab,e=>o("update:activeTab",e)),{children:r,linkChildren:l}=I(ya);l();const i=()=>+n.value<e.tabs.length-1&&e.nextStepText,s=()=>{i()?n.value=+n.value+1:o("confirm",r.map(e=>e.confirm()))},c=()=>o("cancel");return()=>{var o,r;let l=null==(r=null==(o=a.default)?void 0:o.call(a))?void 0:r.filter(e=>e.type!==t.Comment).map(e=>e.type===t.Fragment?e.children:e);l&&(l=l.reduce((e,t)=>e.concat(t),[]));const d=i()?e.nextStepText:e.confirmButtonText;return t.createVNode("div",{class:ba()},[e.showToolbar?t.createVNode(No,{title:e.title,cancelButtonText:e.cancelButtonText,confirmButtonText:d,onConfirm:s,onCancel:c},v(a,xo)):null,t.createVNode(ha,{active:n.value,"onUpdate:active":e=>n.value=e,class:ba("tabs"),shrink:!0,animated:!0,lazyRender:!1},{default:()=>[e.tabs.map((e,o)=>t.createVNode(fa,{title:e,titleClass:ba("tab-title")},{default:()=>[null==l?void 0:l[o]]}))]})])}}});const Va=a({loading:Boolean,readonly:Boolean,allowHtml:Boolean,optionHeight:V(44),showToolbar:b,swipeDuration:V(1e3),visibleOptionNum:V(6)},wo),Na=a({},Va,{columns:w(),modelValue:w(),toolbarPosition:N("top"),columnsFieldNames:Object});var Ca=t.defineComponent({name:io,props:Na,emits:["confirm","cancel","change","scrollInto","clickOption","update:modelValue"],setup(e,{emit:o,slots:n}){const r=t.ref(),i=t.ref(e.modelValue.slice(0)),{parent:s}=D(ya),{children:c,linkChildren:d}=I(go);d();const u=t.computed(()=>function(e){return a({text:"text",value:"value",children:"children"},e)}(e.columnsFieldNames)),p=t.computed(()=>he(e.optionHeight)),f=t.computed(()=>function(e,t){const o=e[0];if(o){if(Array.isArray(o))return"multiple";if(t.children in o)return"cascade"}return"default"}(e.columns,u.value)),h=t.computed(()=>{const{columns:t}=e;switch(f.value){case"multiple":return t;case"cascade":return function(e,t,o){const a=[];let n={[t.children]:e},r=0;for(;n&&n[t.children];){const e=n[t.children],i=o.value[r];n=l(i)?mo(e,i,t):void 0,!n&&e.length&&(n=mo(e,uo(e)[t.value],t)),r++,a.push(e)}return a}(t,u.value,i);default:return[t]}}),g=t.computed(()=>h.value.some(e=>e.length)),b=t.computed(()=>h.value.map((e,t)=>mo(e,i.value[t],u.value))),y=t.computed(()=>h.value.map((e,t)=>e.findIndex(e=>e[u.value.value]===i.value[t]))),w=(e,t)=>{if(i.value[e]!==t){const o=i.value.slice(0);o[e]=t,i.value=o}},x=()=>({selectedValues:i.value.slice(0),selectedOptions:b.value,selectedIndexes:y.value}),V=()=>{c.forEach(e=>e.stopMomentum());const e=x();return t.nextTick(()=>{const e=x();o("confirm",e)}),e},N=()=>o("cancel",x()),C=()=>h.value.map((r,l)=>t.createVNode(bo,{value:i.value[l],fields:u.value,options:r,readonly:e.readonly,allowHtml:e.allowHtml,optionHeight:p.value,swipeDuration:e.swipeDuration,visibleOptionNum:e.visibleOptionNum,onChange:e=>((e,n)=>{w(n,e),"cascade"===f.value&&i.value.forEach((e,t)=>{const o=h.value[t];vo(o,e,u.value)||w(t,o.length?o[0][u.value.value]:void 0)}),t.nextTick(()=>{o("change",a({columnIndex:n},x()))})})(e,l),onClickOption:e=>((e,t)=>{const n={columnIndex:t,currentOption:e};o("clickOption",a(x(),n)),o("scrollInto",n)})(e,l),onScrollInto:e=>{o("scrollInto",{currentOption:e,columnIndex:l})}},{option:n.option})),k=e=>{if(g.value){const o={height:`${p.value}px`},a={backgroundSize:`100% ${(e-p.value)/2}px`};return[t.createVNode("div",{class:so("mask"),style:a},null),t.createVNode("div",{class:[He,so("frame")],style:o},null)]}},S=()=>{const o=p.value*+e.visibleOptionNum,a={height:`${o}px`};return e.loading||g.value||!n.empty?t.createVNode("div",{ref:r,class:so("columns"),style:a},[C(),k(o)]):n.empty()},T=()=>{if(e.showToolbar&&!s)return t.createVNode(No,t.mergeProps(v(e,Vo),{onConfirm:V,onCancel:N}),v(n,xo))},B=e=>{e.forEach((e,t)=>{e.length&&!vo(e,i.value[t],u.value)&&w(t,uo(e)[u.value.value])})};let P;t.watch(h,e=>B(e),{immediate:!0}),t.watch(()=>e.modelValue,t=>{m(t,i.value)||m(t,P)||(i.value=t.slice(0),P=t.slice(0)),0===e.modelValue.length&&B(h.value)},{deep:!0}),t.watch(i,t=>{m(t,e.modelValue)||(P=t.slice(0),o("update:modelValue",P))},{immediate:!0}),R("touchmove",le,{target:r});return ot({confirm:V,getSelectedOptions:()=>b.value}),()=>{var o,a;return t.createVNode("div",{class:so()},["top"===e.toolbarPosition?T():null,e.loading?t.createVNode(Tt,{class:so("loading")},null):null,null==(o=n["columns-top"])?void 0:o.call(n),S(),null==(a=n["columns-bottom"])?void 0:a.call(n),"bottom"===e.toolbarPosition?T():null])}}});const ka="000000",Sa=["title","cancel","confirm","toolbar","columns-top","columns-bottom"],Ta=["title","loading","readonly","optionHeight","swipeDuration","visibleOptionNum","cancelButtonText","confirmButtonText"],Ba=(e="",t=ka,o=void 0)=>({text:e,value:t,children:o});function Pa({areaList:e,columnsNum:t,columnsPlaceholder:o}){const{city_list:a={},county_list:n={},province_list:r={}}=e,l=+t>1,i=+t>2,s=new Map;Object.keys(r).forEach(e=>{s.set(e.slice(0,2),Ba(r[e],e,(()=>{if(l)return o.length>1?[Ba(o[1],ka,i?[]:void 0)]:[]})()))});const c=new Map;if(l){const e=()=>{if(i)return o.length>2?[Ba(o[2])]:[]};Object.keys(a).forEach(t=>{const o=Ba(a[t],t,e());c.set(t.slice(0,4),o);const n=s.get(t.slice(0,2));n&&n.children.push(o)})}i&&Object.keys(n).forEach(e=>{const t=c.get(e.slice(0,4));t&&t.children.push(Ba(n[e],e))});const d=Array.from(s.values());if(o.length){const e=i?[Ba(o[2])]:void 0,t=l?[Ba(o[1],ka,e)]:void 0;d.unshift(Ba(o[0],ka,t))}return d}const Da=Ye(Ca),[Oa,Aa]=Ie("area"),Ia=a({},v(Va,Ta),{modelValue:String,columnsNum:V(3),columnsPlaceholder:w(),areaList:{type:Object,default:()=>({})}});const za=Ye(t.defineComponent({name:Oa,props:Ia,emits:["change","confirm","cancel","update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.ref([]),r=t.ref(),l=t.computed(()=>Pa(e)),i=(...e)=>o("change",...e),s=(...e)=>o("cancel",...e),c=(...e)=>o("confirm",...e);return t.watch(n,t=>{const a=t.length?t[t.length-1]:"";a&&a!==e.modelValue&&o("update:modelValue",a)},{deep:!0}),t.watch(()=>e.modelValue,t=>{if(t){t!==(n.value.length?n.value[n.value.length-1]:"")&&(n.value=[`${t.slice(0,2)}0000`,`${t.slice(0,4)}00`,t].slice(0,+e.columnsNum))}else n.value=[]},{immediate:!0}),ot({confirm:()=>{var e;return null==(e=r.value)?void 0:e.confirm()},getSelectedOptions:()=>{var e;return(null==(e=r.value)?void 0:e.getSelectedOptions())||[]}}),()=>t.createVNode(Da,t.mergeProps({ref:r,modelValue:n.value,"onUpdate:modelValue":e=>n.value=e,class:Aa(),columns:l.value,onChange:i,onCancel:s,onConfirm:c},v(e,Ta)),v(a,Sa))}})),[Ea,$a]=Ie("cell"),La={tag:N("div"),icon:String,size:String,title:g,value:g,label:g,center:Boolean,isLink:Boolean,border:b,iconPrefix:String,valueClass:h,labelClass:h,titleClass:h,titleStyle:null,arrowDirection:String,required:{type:[Boolean,String],default:null},clickable:{type:Boolean,default:null}},Ma=a({},La,at);const Fa=Ye(t.defineComponent({name:Ea,props:Ma,setup(e,{slots:o}){const a=rt(),n=()=>{if(o.label||l(e.label))return t.createVNode("div",{class:[$a("label"),e.labelClass]},[o.label?o.label():e.label])},r=()=>{var a;if(o.title||l(e.title)){const r=null==(a=o.title)?void 0:a.call(o);if(Array.isArray(r)&&0===r.length)return;return t.createVNode("div",{class:[$a("title"),e.titleClass],style:e.titleStyle},[r||t.createVNode("span",null,[e.title]),n()])}},i=()=>{const a=o.value||o.default;if(a||l(e.value))return t.createVNode("div",{class:[$a("value"),e.valueClass]},[a?a():t.createVNode("span",null,[e.value])])},s=()=>{if(o["right-icon"])return o["right-icon"]();if(e.isLink){const o=e.arrowDirection&&"right"!==e.arrowDirection?`arrow-${e.arrowDirection}`:"arrow";return t.createVNode(wt,{name:o,class:$a("right-icon")},null)}};return()=>{var n;const{tag:l,size:c,center:d,border:u,isLink:p,required:v}=e,m=null!=(n=e.clickable)?n:p,f={center:d,required:!!v,clickable:m,borderless:!u};return c&&(f[c]=!!c),t.createVNode(l,{class:$a(f),role:m?"button":void 0,tabindex:m?0:void 0,onClick:a},{default:()=>{var a;return[o.icon?o.icon():e.icon?t.createVNode(wt,{name:e.icon,class:$a("left-icon"),classPrefix:e.iconPrefix},null):void 0,r(),i(),s(),null==(a=o.extra)?void 0:a.call(o)]}})}}})),[Ra,Ha]=Ie("form"),ja={colon:Boolean,disabled:Boolean,readonly:Boolean,required:[Boolean,String],showError:Boolean,labelWidth:g,labelAlign:String,inputAlign:String,scrollToError:Boolean,scrollToErrorPosition:String,validateFirst:Boolean,submitOnEnter:b,showErrorMessage:b,errorMessageAlign:String,validateTrigger:{type:[String,Array],default:"onBlur"}};const Wa=Ye(t.defineComponent({name:Ra,props:ja,emits:["submit","failed"],setup(e,{emit:o,slots:a}){const{children:n,linkChildren:r}=I(We),l=e=>e?n.filter(t=>e.includes(t.name)):n,i=t=>{return"string"==typeof t?(e=>{const t=n.find(t=>t.name===e);return t?new Promise((e,o)=>{t.validate().then(t=>{t?o(t):e()})}):Promise.reject()})(t):e.validateFirst?(o=t,new Promise((e,t)=>{const a=[];l(o).reduce((e,t)=>e.then(()=>{if(!a.length)return t.validate().then(e=>{e&&a.push(e)})}),Promise.resolve()).then(()=>{a.length?t(a):e()})})):(e=>new Promise((t,o)=>{const a=l(e);Promise.all(a.map(e=>e.validate())).then(e=>{(e=e.filter(Boolean)).length?o(e):t()})}))(t);var o},s=(e,t)=>{n.some(o=>o.name===e&&(o.$el.scrollIntoView(t),!0))},c=()=>n.reduce((e,t)=>(void 0!==t.name&&(e[t.name]=t.formValue.value),e),{}),d=()=>{const t=c();i().then(()=>o("submit",t)).catch(a=>{o("failed",{values:t,errors:a});const{scrollToError:n,scrollToErrorPosition:r}=e;n&&a[0].name&&s(a[0].name,r?{block:r}:void 0)})},u=e=>{le(e),d()};return r({props:e}),ot({submit:d,validate:i,getValues:c,scrollToField:s,resetValidation:e=>{"string"==typeof e&&(e=[e]);l(e).forEach(e=>{e.resetValidation()})},getValidationStatus:()=>n.reduce((e,t)=>(e[t.name]=t.getValidationStatus(),e),{})}),()=>{var e;return t.createVNode("form",{class:Ha(),onSubmit:u},[null==(e=a.default)?void 0:e.call(a)])}}}));function Ua(e){return Array.isArray(e)?!e.length:0!==e&&!e}function Ya(e,t){const{message:o}=t;return i(o)?o(e,t):o||""}function Xa({target:e}){e.composing=!0}function qa({target:e}){e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}function Ga(e){return[...e].length}function Za(e,t){return[...e].slice(0,t).join("")}const[Ka,_a]=Ie("field"),Ja={id:String,name:String,leftIcon:String,rightIcon:String,autofocus:Boolean,clearable:Boolean,maxlength:g,max:Number,min:Number,formatter:Function,clearIcon:N("clear"),modelValue:V(""),inputAlign:String,placeholder:String,autocomplete:String,autocapitalize:String,autocorrect:String,errorMessage:String,enterkeyhint:String,clearTrigger:N("focus"),formatTrigger:N("onChange"),spellcheck:{type:Boolean,default:null},error:{type:Boolean,default:null},disabled:{type:Boolean,default:null},readonly:{type:Boolean,default:null},inputmode:String},Qa=a({},La,Ja,{rows:g,type:N("text"),rules:Array,autosize:[Boolean,Object],labelWidth:g,labelClass:h,labelAlign:String,showWordLimit:Boolean,errorMessageAlign:String,colon:{type:Boolean,default:null}});const en=Ye(t.defineComponent({name:Ka,props:Qa,emits:["blur","focus","clear","keypress","clickInput","endValidate","startValidate","clickLeftIcon","clickRightIcon","update:modelValue"],setup(e,{emit:o,slots:a}){const n=Lo(),i=t.reactive({status:"unvalidated",focused:!1,validateMessage:""}),c=t.ref(),d=t.ref(),u=t.ref(),{parent:p}=D(We),v=()=>{var t;return String(null!=(t=e.modelValue)?t:"")},m=t=>l(e[t])?e[t]:p&&l(p.props[t])?p.props[t]:void 0,h=t.computed(()=>{const t=m("readonly");if(e.clearable&&!t){const t=""!==v(),o="always"===e.clearTrigger||"focus"===e.clearTrigger&&i.focused;return t&&o}return!1}),g=t.computed(()=>u.value&&a.input?u.value():e.modelValue),b=t.computed(()=>{var t;const o=m("required");return"auto"===o?null==(t=e.rules)?void 0:t.some(e=>e.required):o}),y=e=>e.reduce((e,t)=>e.then(()=>{if("failed"===i.status)return;let{value:e}=g;if(t.formatter&&(e=t.formatter(e,t)),!function(e,t){if(Ua(e)){if(t.required)return!1;if(!1===t.validateEmpty)return!0}return!(t.pattern&&!t.pattern.test(String(e)))}(e,t))return i.status="failed",void(i.validateMessage=Ya(e,t));if(t.validator){if(Ua(e)&&!1===t.validateEmpty)return;return function(e,t){return new Promise(o=>{const a=t.validator(e,t);s(a)?a.then(o):o(a)})}(e,t).then(o=>{o&&"string"==typeof o?(i.status="failed",i.validateMessage=o):!1===o&&(i.status="failed",i.validateMessage=Ya(e,t))})}}),Promise.resolve()),w=()=>{i.status="unvalidated",i.validateMessage=""},x=()=>o("endValidate",{status:i.status,message:i.validateMessage}),V=(t=e.rules)=>new Promise(a=>{w(),t?(o("startValidate"),y(t).then(()=>{"failed"===i.status?(a({name:e.name,message:i.validateMessage}),x()):(i.status="passed",a(),x())})):a()}),N=t=>{if(p&&e.rules){const{validateTrigger:o}=p.props,a=f(o).includes(t),n=e.rules.filter(e=>e.trigger?f(e.trigger).includes(t):a);n.length&&V(n)}},C=(t,a="onChange")=>{var n,r;const s=t;t=(t=>{var o;const{maxlength:a}=e;if(l(a)&&Ga(t)>+a){const e=v();if(e&&Ga(e)===+a)return e;const n=null==(o=c.value)?void 0:o.selectionEnd;if(i.focused&&n){const e=[...t],o=e.length-+a;return e.splice(n-o,o),e.join("")}return Za(t,+a)}return t})(t);const d=Ga(s)-Ga(t);if("number"===e.type||"digit"===e.type){const o="number"===e.type;if(t=Ve(t,o,o),"onBlur"===a&&""!==t&&(void 0!==e.min||void 0!==e.max)){const o=we(+t,null!=(n=e.min)?n:-1/0,null!=(r=e.max)?r:1/0);+t!==o&&(t=o.toString())}}let u=0;if(e.formatter&&a===e.formatTrigger){const{formatter:o,maxlength:a}=e;if(t=o(t),l(a)&&Ga(t)>+a&&(t=Za(t,+a)),c.value&&i.focused){const{selectionEnd:e}=c.value,t=Za(s,e);u=Ga(o(t))-Ga(t)}}if(c.value&&c.value.value!==t)if(i.focused){let{selectionStart:e,selectionEnd:o}=c.value;if(c.value.value=t,l(e)&&l(o)){const a=Ga(t);d?(e-=d,o-=d):u&&(e+=u,o+=u),c.value.setSelectionRange(Math.min(e,a),Math.min(o,a))}}else c.value.value=t;t!==e.modelValue&&o("update:modelValue",t)},k=e=>{e.target.composing||C(e.target.value)},S=()=>{var e;return null==(e=c.value)?void 0:e.blur()},T=()=>{var e;return null==(e=c.value)?void 0:e.focus()},B=()=>{const t=c.value;"textarea"===e.type&&e.autosize&&t&&function(e,t){const o=ee();e.style.height="auto";let a=e.scrollHeight;if(r(t)){const{maxHeight:e,minHeight:o}=t;void 0!==e&&(a=Math.min(a,e)),void 0!==o&&(a=Math.max(a,o))}a&&(e.style.height=`${a}px`,te(o))}(t,e.autosize)},P=e=>{i.focused=!0,o("focus",e),t.nextTick(B),m("readonly")&&S()},O=e=>{i.focused=!1,C(v(),"onBlur"),o("blur",e),m("readonly")||(N("onBlur"),t.nextTick(B),ne())},A=e=>o("clickInput",e),I=e=>o("clickLeftIcon",e),z=e=>o("clickRightIcon",e),E=t.computed(()=>"boolean"==typeof e.error?e.error:!(!p||!p.props.showError||"failed"!==i.status)||void 0),$=t.computed(()=>{const e=m("labelWidth"),t=m("labelAlign");if(e&&"top"!==t)return{width:ue(e)}}),L=t=>{if(13===t.keyCode){p&&p.props.submitOnEnter||"textarea"===e.type||le(t),"search"===e.type&&S()}o("keypress",t)},M=()=>e.id||`${n}-input`,F=()=>{const o=_a("control",[m("inputAlign"),{error:E.value,custom:!!a.input,"min-height":"textarea"===e.type&&!e.autosize}]);if(a.input)return t.createVNode("div",{class:o,onClick:A},[a.input()]);const r={id:M(),ref:c,name:e.name,rows:void 0!==e.rows?+e.rows:void 0,class:o,disabled:m("disabled"),readonly:m("readonly"),autofocus:e.autofocus,placeholder:e.placeholder,autocomplete:e.autocomplete,autocapitalize:e.autocapitalize,autocorrect:e.autocorrect,enterkeyhint:e.enterkeyhint,spellcheck:e.spellcheck,"aria-labelledby":e.label?`${n}-label`:void 0,"data-allow-mismatch":"attribute",onBlur:O,onFocus:P,onInput:k,onClick:A,onChange:qa,onKeypress:L,onCompositionend:qa,onCompositionstart:Xa};return"textarea"===e.type?t.createVNode("textarea",t.mergeProps(r,{inputmode:e.inputmode}),null):t.createVNode("input",t.mergeProps((l=e.type,i=e.inputmode,"number"===l&&(l="text",null!=i||(i="decimal")),"digit"===l&&(l="tel",null!=i||(i="numeric")),{type:l,inputmode:i}),r),null);var l,i},H=()=>{const o=a["right-icon"];if(e.rightIcon||o)return t.createVNode("div",{class:_a("right-icon"),onClick:z},[o?o():t.createVNode(wt,{name:e.rightIcon,classPrefix:e.iconPrefix},null)])},j=()=>{if(e.showWordLimit&&e.maxlength){const o=Ga(v());return t.createVNode("div",{class:_a("word-limit")},[t.createVNode("span",{class:_a("word-num")},[o]),t.createTextVNode("/"),e.maxlength])}},W=()=>{if(p&&!1===p.props.showErrorMessage)return;const o=e.errorMessage||i.validateMessage;if(o){const e=a["error-message"],n=m("errorMessageAlign");return t.createVNode("div",{class:_a("error-message",n)},[e?e({message:o}):o])}},U=()=>[t.createVNode("div",{class:_a("body")},[F(),h.value&&t.createVNode(wt,{ref:d,name:e.clearIcon,class:_a("clear")},null),H(),a.button&&t.createVNode("div",{class:_a("button")},[a.button()])]),j(),W()];return ot({blur:S,focus:T,validate:V,formValue:g,resetValidation:w,getValidationStatus:()=>i.status}),t.provide(K,{customValue:u,resetValidation:w,validateWithTrigger:N}),t.watch(()=>e.modelValue,()=>{C(v()),w(),N("onChange"),t.nextTick(B)}),t.onMounted(()=>{C(v(),e.formatTrigger),t.nextTick(B)}),R("touchstart",e=>{le(e),o("update:modelValue",""),o("clear",e)},{target:t.computed(()=>{var e;return null==(e=d.value)?void 0:e.$el})}),()=>{const o=m("disabled"),r=m("labelAlign"),l=(()=>{const o=a["left-icon"];if(e.leftIcon||o)return t.createVNode("div",{class:_a("left-icon"),onClick:I},[o?o():t.createVNode(wt,{name:e.leftIcon,classPrefix:e.iconPrefix},null)])})();return t.createVNode(Fa,{size:e.size,class:_a({error:E.value,disabled:o,[`label-${r}`]:r}),center:e.center,border:e.border,isLink:e.isLink,clickable:e.clickable,titleStyle:$.value,valueClass:_a("value"),titleClass:[_a("label",[r,{required:b.value}]),e.labelClass],arrowDirection:e.arrowDirection},{icon:l&&"top"!==r?()=>l:null,title:()=>{const o=(()=>{const o=m("labelWidth"),r=m("labelAlign"),l=m("colon")?":":"";return a.label?[a.label(),l]:e.label?t.createVNode("label",{id:`${n}-label`,for:a.input?void 0:M(),"data-allow-mismatch":"attribute",onClick:e=>{le(e),T()},style:"top"===r&&o?{width:ue(o)}:void 0},[e.label+l]):void 0})();return"top"===r?[l,o].filter(Boolean):o||[]},value:U,extra:a.extra})}}}));let tn=0;const[on,an]=Ie("toast"),nn=["show","overlay","teleport","transition","overlayClass","overlayStyle","closeOnClickOverlay","zIndex"],rn={icon:String,show:Boolean,type:N("text"),overlay:Boolean,message:g,iconSize:g,duration:x(2e3),position:N("middle"),teleport:[String,Object],wordBreak:String,className:h,iconPrefix:String,transition:N("van-fade"),loadingType:String,forbidClick:Boolean,overlayClass:h,overlayStyle:Object,closeOnClick:Boolean,closeOnClickOverlay:Boolean,zIndex:g};var ln=t.defineComponent({name:on,props:rn,emits:["update:show"],setup(e,{emit:o,slots:a}){let n,r=!1;const i=()=>{const t=e.show&&e.forbidClick;r!==t&&(r=t,r?(tn||document.body.classList.add("van-toast--unclickable"),tn++):tn&&(tn--,tn||document.body.classList.remove("van-toast--unclickable")))},s=e=>o("update:show",e),c=()=>{e.closeOnClick&&s(!1)},d=()=>clearTimeout(n),u=()=>{const{icon:o,type:a,iconSize:n,iconPrefix:r,loadingType:l}=e;return o||"success"===a||"fail"===a?t.createVNode(wt,{name:o||a,size:n,class:an("icon"),classPrefix:r},null):"loading"===a?t.createVNode(Tt,{class:an("loading"),size:n,type:l},null):void 0},p=()=>{const{type:o,message:n}=e;return a.message?t.createVNode("div",{class:an("text")},[a.message()]):l(n)&&""!==n?"html"===o?t.createVNode("div",{key:0,class:an("text"),innerHTML:String(n)},null):t.createVNode("div",{class:an("text")},[n]):void 0};return t.watch(()=>[e.show,e.forbidClick],i),t.watch(()=>[e.show,e.type,e.message,e.duration],()=>{d(),e.show&&e.duration>0&&(n=setTimeout(()=>{s(!1)},e.duration))}),t.onMounted(i),t.onUnmounted(i),()=>t.createVNode(to,t.mergeProps({class:[an([e.position,"normal"===e.wordBreak?"break-normal":e.wordBreak,{[e.type]:!e.icon}]),e.className],lockScroll:!1,onClick:c,onClosed:d,"onUpdate:show":s},v(e,nn)),{default:()=>[u(),p()]})}});function sn(){const e=t.reactive({show:!1}),o=t=>{e.show=t},n=t=>{a(e,t,{transitionAppear:!0}),o(!0)},r=()=>o(!1);return ot({open:n,close:r,toggle:o}),{open:n,close:r,state:e,toggle:o}}function cn(e){const o=t.createApp(e),a=document.createElement("div");return document.body.appendChild(a),{instance:o.mount(a),unmount(){o.unmount(),document.body.removeChild(a)}}}const dn={icon:"",type:"text",message:"",className:"",overlay:!1,onClose:void 0,onOpened:void 0,duration:2e3,teleport:"body",iconSize:void 0,iconPrefix:void 0,position:"middle",transition:"van-fade",forbidClick:!1,loadingType:void 0,overlayClass:"",overlayStyle:void 0,closeOnClick:!1,closeOnClickOverlay:!1};let un=[],pn=!1,vn=a({},dn);const mn=new Map;function fn(e){return r(e)?e:{message:e}}function hn(){if(!un.length||pn){const e=function(){const{instance:e,unmount:o}=cn({setup(){const a=t.ref(""),{open:n,state:r,close:l,toggle:i}=sn(),s=()=>{pn&&(un=un.filter(t=>t!==e),o())};return t.watch(a,e=>{r.message=e}),t.getCurrentInstance().render=()=>{const e={onClosed:s,"onUpdate:show":i};return t.createVNode(ln,t.mergeProps(r,e),null)},{open:n,close:l,message:a}}});return e}();un.push(e)}return un[un.length-1]}function gn(e={}){if(!n)return{};const t=hn(),o=fn(e);return t.open(a({},vn,mn.get(o.type||vn.type),o)),t}const bn=e=>t=>gn(a({type:e},fn(t))),yn=bn("loading"),wn=bn("success"),xn=bn("fail");const Vn=Ye(ln),[Nn,Cn]=Ie("switch"),kn={size:g,loading:Boolean,disabled:Boolean,modelValue:h,activeColor:String,inactiveColor:String,activeValue:{type:h,default:!0},inactiveValue:{type:h,default:!1}};const Sn=Ye(t.defineComponent({name:Nn,props:kn,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const n=()=>e.modelValue===e.activeValue,r=()=>{if(!e.disabled&&!e.loading){const t=n()?e.inactiveValue:e.activeValue;o("update:modelValue",t),o("change",t)}},l=()=>{if(e.loading){const o=n()?e.activeColor:e.inactiveColor;return t.createVNode(Tt,{class:Cn("loading"),color:o},null)}if(a.node)return a.node()};return _(()=>e.modelValue),()=>{var o;const{size:i,loading:s,disabled:c,activeColor:d,inactiveColor:u}=e,p=n(),v={fontSize:ue(i),backgroundColor:p?d:u};return t.createVNode("div",{role:"switch",class:Cn({on:p,loading:s,disabled:c}),style:v,tabindex:c?void 0:0,"aria-checked":p,onClick:r},[t.createVNode("div",{class:Cn("node")},[l()]),null==(o=a.background)?void 0:o.call(a)])}}})),[Tn,Bn]=Ie("address-edit-detail"),Pn=Ie("address-edit")[2];var Dn=t.defineComponent({name:Tn,props:{show:Boolean,rows:g,value:String,rules:Array,focused:Boolean,maxlength:g,searchResult:Array,showSearchResult:Boolean},emits:["blur","focus","input","selectSearch"],setup(e,{emit:o}){const a=t.ref(),n=()=>e.focused&&e.searchResult&&e.showSearchResult,r=()=>{if(!n())return;const{searchResult:a}=e;return a.map(e=>t.createVNode(Fa,{clickable:!0,key:(e.name||"")+(e.address||""),icon:"location-o",title:e.name,label:e.address,class:Bn("search-item"),border:!1,onClick:()=>(e=>{o("selectSearch",e),o("input",`${e.address||""} ${e.name||""}`.trim())})(e)},null))},l=e=>o("blur",e),i=e=>o("focus",e),s=e=>o("input",e);return()=>{if(e.show)return t.createVNode(t.Fragment,null,[t.createVNode(en,{autosize:!0,clearable:!0,ref:a,class:Bn(),rows:e.rows,type:"textarea",rules:e.rules,label:Pn("addressDetail"),border:!n(),maxlength:e.maxlength,modelValue:e.value,placeholder:Pn("addressDetail"),onBlur:l,onFocus:i,"onUpdate:modelValue":s},null),r()])}}});const[On,An,In]=Ie("address-edit"),zn={name:"",tel:"",city:"",county:"",province:"",areaCode:"",isDefault:!1,addressDetail:""},En={areaList:Object,isSaving:Boolean,isDeleting:Boolean,validator:Function,showArea:b,showDetail:b,showDelete:Boolean,disableArea:Boolean,searchResult:Array,telMaxlength:g,showSetDefault:Boolean,saveButtonText:String,areaPlaceholder:String,deleteButtonText:String,showSearchResult:Boolean,detailRows:V(1),detailMaxlength:V(200),areaColumnsPlaceholder:w(),addressInfo:{type:Object,default:()=>a({},zn)},telValidator:{type:Function,default:d}};const $n=Ye(t.defineComponent({name:On,props:En,emits:["save","focus","change","delete","clickArea","changeArea","changeDetail","selectSearch","changeDefault"],setup(e,{emit:o,slots:n}){const l=t.ref(),i=t.reactive({}),s=t.ref(!1),c=t.ref(!1),d=t.computed(()=>r(e.areaList)&&Object.keys(e.areaList).length),u=t.computed(()=>{const{province:e,city:t,county:o,areaCode:a}=i;if(a){const a=[e,t,o];return e&&e===t&&a.splice(1,1),a.filter(Boolean).join("/")}return""}),p=t.computed(()=>{var t;return(null==(t=e.searchResult)?void 0:t.length)&&c.value}),v=e=>{c.value="addressDetail"===e,o("focus",e)},m=(e,t)=>{o("change",{key:e,value:t})},f=t.computed(()=>{const{validator:t,telValidator:o}=e,a=(e,o)=>({validator:a=>{if(t){const o=t(e,a);if(o)return o}return!!a||o}});return{name:[a("name",In("nameEmpty"))],tel:[a("tel",In("telInvalid")),{validator:o,message:In("telInvalid")}],areaCode:[a("areaCode",In("areaEmpty"))],addressDetail:[a("addressDetail",In("addressEmpty"))]}}),h=()=>o("save",i),g=e=>{i.addressDetail=e,o("changeDetail",e)},b=e=>{i.province=e[0].text,i.city=e[1].text,i.county=e[2].text},y=({selectedValues:e,selectedOptions:t})=>{e.some(e=>e===ka)?gn(In("areaEmpty")):(s.value=!1,b(t),o("changeArea",t))},w=()=>o("delete",i),x=()=>{setTimeout(()=>{c.value=!1})},V=()=>{if(e.showSetDefault){const e={"right-icon":()=>t.createVNode(Sn,{modelValue:i.isDefault,"onUpdate:modelValue":e=>i.isDefault=e,onChange:e=>o("changeDefault",e)},null)};return t.withDirectives(t.createVNode(Fa,{center:!0,border:!1,title:In("defaultAddress"),class:An("default")},e),[[t.vShow,!p.value]])}};return ot({setAreaCode:e=>{i.areaCode=e||""},setAddressDetail:e=>{i.addressDetail=e}}),t.watch(()=>e.addressInfo,e=>{a(i,zn,e),t.nextTick(()=>{var e;const t=null==(e=l.value)?void 0:e.getSelectedOptions();t&&t.every(e=>e&&e.value!==ka)&&b(t)})},{deep:!0,immediate:!0}),()=>{const{disableArea:a}=e;return t.createVNode(Wa,{class:An(),onSubmit:h},{default:()=>{var r;return[t.createVNode("div",{class:An("fields")},[t.createVNode(en,{modelValue:i.name,"onUpdate:modelValue":[e=>i.name=e,e=>m("name",e)],clearable:!0,label:In("name"),rules:f.value.name,placeholder:In("name"),onFocus:()=>v("name")},null),t.createVNode(en,{modelValue:i.tel,"onUpdate:modelValue":[e=>i.tel=e,e=>m("tel",e)],clearable:!0,type:"tel",label:In("tel"),rules:f.value.tel,maxlength:e.telMaxlength,placeholder:In("tel"),onFocus:()=>v("tel")},null),t.withDirectives(t.createVNode(en,{readonly:!0,label:In("area"),"is-link":!a,modelValue:u.value,rules:e.showArea?f.value.areaCode:void 0,placeholder:e.areaPlaceholder||In("area"),onFocus:()=>v("areaCode"),onClick:()=>{o("clickArea"),s.value=!a}},null),[[t.vShow,e.showArea]]),t.createVNode(Dn,{show:e.showDetail,rows:e.detailRows,rules:f.value.addressDetail,value:i.addressDetail,focused:c.value,maxlength:e.detailMaxlength,searchResult:e.searchResult,showSearchResult:e.showSearchResult,onBlur:x,onFocus:()=>v("addressDetail"),onInput:g,onSelectSearch:e=>o("selectSearch",e)},null),null==(r=n.default)?void 0:r.call(n)]),V(),t.withDirectives(t.createVNode("div",{class:An("buttons")},[t.createVNode(Ot,{block:!0,round:!0,type:"primary",text:e.saveButtonText||In("save"),class:An("button"),loading:e.isSaving,nativeType:"submit"},null),e.showDelete&&t.createVNode(Ot,{block:!0,round:!0,class:An("button"),loading:e.isDeleting,text:e.deleteButtonText||In("delete"),onClick:w},null)]),[[t.vShow,!p.value]]),t.createVNode(to,{show:s.value,"onUpdate:show":e=>s.value=e,round:!0,teleport:"body",position:"bottom",lazyRender:!1},{default:()=>[t.createVNode(za,{modelValue:i.areaCode,"onUpdate:modelValue":e=>i.areaCode=e,ref:l,loading:!d.value,areaList:e.areaList,columnsPlaceholder:e.areaColumnsPlaceholder,onConfirm:y,onCancel:()=>{s.value=!1}},null)]})]}})}}})),[Ln,Mn]=Ie("radio-group"),Fn={shape:String,disabled:Boolean,iconSize:g,direction:String,modelValue:h,checkedColor:String},Rn=Symbol(Ln);const Hn=Ye(t.defineComponent({name:Ln,props:Fn,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const{linkChildren:n}=I(Rn);return t.watch(()=>e.modelValue,e=>o("change",e)),n({props:e,updateValue:e=>o("update:modelValue",e)}),_(()=>e.modelValue),()=>{var o;return t.createVNode("div",{class:Mn([e.direction]),role:"radiogroup"},[null==(o=a.default)?void 0:o.call(a)])}}})),[jn,Wn]=Ie("checkbox-group"),Un={max:g,shape:N("round"),disabled:Boolean,iconSize:g,direction:String,modelValue:w(),checkedColor:String},Yn=Symbol(jn);const Xn=Ye(t.defineComponent({name:jn,props:Un,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const{children:n,linkChildren:r}=I(Yn),l=e=>o("update:modelValue",e);return t.watch(()=>e.modelValue,e=>o("change",e)),ot({toggleAll:(e={})=>{"boolean"==typeof e&&(e={checked:e});const{checked:t,skipDisabled:o}=e,a=n.filter(e=>!!e.props.bindGroup&&(e.props.disabled&&o?e.checked.value:null!=t?t:!e.checked.value)).map(e=>e.name);l(a)}}),_(()=>e.modelValue),r({props:e,updateValue:l}),()=>{var o;return t.createVNode("div",{class:Wn([e.direction])},[null==(o=a.default)?void 0:o.call(a)])}}})),[qn,Gn]=Ie("tag"),Zn={size:String,mark:Boolean,show:b,type:N("default"),color:String,plain:Boolean,round:Boolean,textColor:String,closeable:Boolean};const Kn=Ye(t.defineComponent({name:qn,props:Zn,emits:["close"],setup(e,{slots:o,emit:a}){const n=e=>{e.stopPropagation(),a("close",e)},r=()=>{var a;const{type:r,mark:l,plain:i,round:s,size:c,closeable:d}=e,u={mark:l,plain:i,round:s};c&&(u[c]=c);const p=d&&t.createVNode(wt,{name:"cross",class:[Gn("close"),je],onClick:n},null);return t.createVNode("span",{style:e.plain?{color:e.textColor||e.color,borderColor:e.color}:{color:e.textColor,background:e.color},class:Gn([u,r])},[null==(a=o.default)?void 0:a.call(o),p])};return()=>t.createVNode(t.Transition,{name:e.closeable?"van-fade":void 0},{default:()=>[e.show?r():null]})}})),_n={name:h,disabled:Boolean,iconSize:g,modelValue:h,checkedColor:String,labelPosition:String,labelDisabled:Boolean};var Jn=t.defineComponent({props:a({},_n,{bem:y(Function),role:String,shape:String,parent:Object,checked:Boolean,bindGroup:b,indeterminate:{type:Boolean,default:null}}),emits:["click","toggle"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=t=>{if(e.parent&&e.bindGroup)return e.parent.props[t]},l=t.computed(()=>{if(e.parent&&e.bindGroup){const t=r("disabled")||e.disabled;if("checkbox"===e.role){const o=r("modelValue").length,a=r("max");return t||a&&o>=+a&&!e.checked}return t}return e.disabled}),i=t.computed(()=>r("direction")),s=t.computed(()=>{const t=e.checkedColor||r("checkedColor");if(t&&(e.checked||e.indeterminate)&&!l.value)return{borderColor:t,backgroundColor:t}}),c=t.computed(()=>e.shape||r("shape")||"round"),d=t=>{const{target:a}=t,r=n.value,i=r===a||(null==r?void 0:r.contains(a));l.value||!i&&e.labelDisabled||o("toggle"),o("click",t)},u=()=>{var o,i;const{bem:d,checked:u,indeterminate:p}=e,v=e.iconSize||r("iconSize");return t.createVNode("div",{ref:n,class:d("icon",[c.value,{disabled:l.value,checked:u,indeterminate:p}]),style:"dot"!==c.value?{fontSize:ue(v)}:{width:ue(v),height:ue(v),borderColor:null==(o=s.value)?void 0:o.borderColor}},[a.icon?a.icon({checked:u,disabled:l.value}):"dot"!==c.value?t.createVNode(wt,{name:p?"minus":"success",style:s.value},null):t.createVNode("div",{class:d("icon--dot__icon"),style:{backgroundColor:null==(i=s.value)?void 0:i.backgroundColor}},null)])},p=()=>{const{checked:o}=e;if(a.default)return t.createVNode("span",{class:e.bem("label",[e.labelPosition,{disabled:l.value}])},[a.default({checked:o,disabled:l.value})])};return()=>{const o="left"===e.labelPosition?[p(),u()]:[u(),p()];return t.createVNode("div",{role:e.role,class:e.bem([{disabled:l.value,"label-disabled":e.labelDisabled},i.value]),tabindex:l.value?void 0:0,"aria-checked":e.checked,onClick:d},[o])}}});const Qn=a({},_n,{shape:String}),[er,tr]=Ie("radio");const or=Ye(t.defineComponent({name:er,props:Qn,emits:["update:modelValue"],setup(e,{emit:o,slots:a}){const{parent:n}=D(Rn),r=()=>{n?n.updateValue(e.name):o("update:modelValue",e.name)};return()=>t.createVNode(Jn,t.mergeProps({bem:tr,role:"radio",parent:n,checked:(n?n.props.modelValue:e.modelValue)===e.name,onToggle:r},e),v(a,["default","icon"]))}})),[ar,nr]=Ie("checkbox"),rr=a({},_n,{shape:String,bindGroup:b,indeterminate:{type:Boolean,default:null}});const lr=Ye(t.defineComponent({name:ar,props:rr,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const{parent:n}=D(Yn),r=t.computed(()=>n&&e.bindGroup?-1!==n.props.modelValue.indexOf(e.name):!!e.modelValue),l=(t=!r.value)=>{n&&e.bindGroup?(t=>{const{name:o}=e,{max:a,modelValue:r}=n.props,l=r.slice();if(t)a&&l.length>=+a||l.includes(o)||(l.push(o),e.bindGroup&&n.updateValue(l));else{const t=l.indexOf(o);-1!==t&&(l.splice(t,1),e.bindGroup&&n.updateValue(l))}})(t):o("update:modelValue",t),null!==e.indeterminate&&o("change",t)};return t.watch(()=>e.modelValue,t=>{null===e.indeterminate&&o("change",t)}),ot({toggle:l,props:e,checked:r}),_(()=>e.modelValue),()=>t.createVNode(Jn,t.mergeProps({bem:nr,role:"checkbox",parent:n,checked:r.value,onToggle:l},e),v(a,["default","icon"]))}})),[ir,sr]=Ie("address-item");var cr=t.defineComponent({name:ir,props:{address:y(Object),disabled:Boolean,switchable:Boolean,singleChoice:Boolean,defaultTagText:String,rightIcon:N("edit")},emits:["edit","click","select"],setup(e,{slots:o,emit:n}){const r=t=>{e.switchable&&n("select"),n("click",t)},l=()=>t.createVNode(wt,{name:e.rightIcon,class:sr("edit"),onClick:e=>{e.stopPropagation(),n("edit"),n("click",e)}},null),i=()=>{const{address:a,disabled:n,switchable:r,singleChoice:l}=e,i=[t.createVNode("div",{class:sr("name")},[`${a.name} ${a.tel}`,o.tag?o.tag(e.address):e.address.isDefault&&e.defaultTagText?t.createVNode(Kn,{type:"primary",round:!0,class:sr("tag")},{default:()=>[e.defaultTagText]}):void 0]),t.createVNode("div",{class:sr("address")},[a.address])];return r&&!n?l?t.createVNode(or,{name:a.id,iconSize:18},{default:()=>[i]}):t.createVNode(lr,{name:a.id,iconSize:18},{default:()=>[i]}):i};return()=>{var n;const{disabled:s}=e;return t.createVNode("div",{class:sr({disabled:s}),onClick:r},[t.createVNode(Fa,{border:!1,titleClass:sr("title")},{title:i,"right-icon":l}),null==(n=o.bottom)?void 0:n.call(o,a({},e.address,{disabled:s}))])}}});const[dr,ur,pr]=Ie("address-list"),vr={list:w(),modelValue:[...g,Array],switchable:b,disabledText:String,disabledList:w(),showAddButton:b,addButtonText:String,defaultTagText:String,rightIcon:N("edit")};const mr=Ye(t.defineComponent({name:dr,props:vr,emits:["add","edit","select","clickItem","editDisabled","selectDisabled","update:modelValue"],setup(e,{slots:o,emit:a}){const n=t.computed(()=>!Array.isArray(e.modelValue)),r=(r,l)=>{if(r)return r.map((r,i)=>((r,l,i)=>t.createVNode(cr,{key:r.id,address:r,disabled:i,switchable:e.switchable,singleChoice:n.value,defaultTagText:e.defaultTagText,rightIcon:e.rightIcon,onEdit:()=>a(i?"editDisabled":"edit",r,l),onClick:e=>a("clickItem",r,l,{event:e}),onSelect:()=>{if(a(i?"selectDisabled":"select",r,l),!i)if(n.value)a("update:modelValue",r.id);else{const t=e.modelValue;t.includes(r.id)?a("update:modelValue",t.filter(e=>e!==r.id)):a("update:modelValue",[...t,r.id])}}},{bottom:o["item-bottom"],tag:o.tag}))(r,i,l))};return()=>{var l,i;const s=r(e.list),c=r(e.disabledList,!0),d=e.disabledText&&t.createVNode("div",{class:ur("disabled-text")},[e.disabledText]);return t.createVNode("div",{class:ur()},[null==(l=o.top)?void 0:l.call(o),!n.value&&Array.isArray(e.modelValue)?t.createVNode(Xn,{modelValue:e.modelValue},{default:()=>[s]}):t.createVNode(Hn,{modelValue:e.modelValue},{default:()=>[s]}),d,c,null==(i=o.default)?void 0:i.call(o),e.showAddButton?t.createVNode("div",{class:[ur("bottom"),"van-safe-area-bottom"]},[t.createVNode(Ot,{round:!0,block:!0,type:"primary",text:e.addButtonText||pr("add"),class:ur("add"),onClick:()=>a("add")},null)]):void 0])}}})),fr=C&&"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype,hr="event",gr="observer";function br(e,t){if(!e.length)return;const o=e.indexOf(t);return o>-1?e.splice(o,1):void 0}function yr(e,t){if("IMG"!==e.tagName||!e.getAttribute("data-srcset"))return;let o=e.getAttribute("data-srcset");const a=e.parentNode.offsetWidth*t;let n,r,l;o=o.trim().split(",");const i=o.map(e=>(e=e.trim(),n=e.lastIndexOf(" "),-1===n?(r=e,l=999998):(r=e.substr(0,n),l=parseInt(e.substr(n+1,e.length-n-2),10)),[l,r]));i.sort((e,t)=>{if(e[0]<t[0])return 1;if(e[0]>t[0])return-1;if(e[0]===t[0]){if(-1!==t[1].indexOf(".webp",t[1].length-5))return 1;if(-1!==e[1].indexOf(".webp",e[1].length-5))return-1}return 0});let s,c="";for(let d=0;d<i.length;d++){s=i[d],c=s[1];const e=i[d+1];if(e&&e[0]<a){c=s[1];break}if(!e){c=s[1];break}}return c}const wr=(e=1)=>C&&window.devicePixelRatio||e;function xr(){if(!C)return!1;let e=!0;try{const t=document.createElement("canvas");t.getContext&&t.getContext("2d")&&(e=0===t.toDataURL("image/webp").indexOf("data:image/webp"))}catch(t){e=!1}return e}function Vr(e,t){let o=null,a=0;return function(...n){if(o)return;const r=()=>{a=Date.now(),o=!1,e.apply(this,n)};Date.now()-a>=t?r():o=setTimeout(r,t)}}function Nr(e,t,o){e.addEventListener(t,o,{capture:!1,passive:!0})}function Cr(e,t,o){e.removeEventListener(t,o,!1)}const kr=(e,t,o)=>{const a=new Image;if(!e||!e.src)return o(new Error("image src is required"));a.src=e.src,e.cors&&(a.crossOrigin=e.cors),a.onload=()=>t({naturalHeight:a.naturalHeight,naturalWidth:a.naturalWidth,src:a.src}),a.onerror=e=>o(e)};class Sr{constructor({max:e}){this.options={max:e||100},this.caches=[]}has(e){return this.caches.indexOf(e)>-1}add(e){this.has(e)||(this.caches.push(e),this.caches.length>this.options.max&&this.free())}free(){this.caches.shift()}}const[Tr,Br]=Ie("back-top"),Pr={right:g,bottom:g,zIndex:g,target:[String,Object],offset:V(200),immediate:Boolean,teleport:{type:[String,Object],default:"body"}};const Dr=Ye(t.defineComponent({name:Tr,inheritAttrs:!1,props:Pr,emits:["click"],setup(e,{emit:o,slots:r,attrs:l}){let i=!1;const s=t.ref(!1),c=t.ref(),d=t.ref(),u=t.computed(()=>a(ve(e.zIndex),{right:ue(e.right),bottom:ue(e.bottom)})),p=t=>{var a;o("click",t),null==(a=d.value)||a.scrollTo({top:0,behavior:e.immediate?"auto":"smooth"})},v=()=>{s.value=!!d.value&&J(d.value)>=+e.offset},m=()=>{n&&t.nextTick(()=>{d.value=e.target?(()=>{const{target:t}=e;if("string"!=typeof t)return t;{const e=document.querySelector(t);if(e)return e}})():q(c.value),v()})};return R("scroll",Vr(v,100),{target:d}),t.onMounted(m),t.onActivated(()=>{i&&(s.value=!0,i=!1)}),t.onDeactivated(()=>{s.value&&e.teleport&&(s.value=!1,i=!0)}),t.watch(()=>e.target,m),()=>{const o=t.createVNode("div",t.mergeProps({ref:e.teleport?void 0:c,class:Br({active:s.value}),style:u.value,onClick:p},l),[r.default?r.default():t.createVNode(wt,{name:"back-top",class:Br("icon")},null)]);return e.teleport?[t.createVNode("div",{ref:c,class:Br("placeholder")},null),t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[o]})]:o}}}));const Or={top:V(10),rows:V(4),duration:V(4e3),autoPlay:b,delay:x(300),modelValue:w()},[Ar,Ir]=Ie("barrage");const zr=Ye(t.defineComponent({name:Ar,props:Or,emits:["update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=Ir("item"),l=t.ref(0),i=[],s=t.ref(!0),c=t.ref(e.autoPlay),d=({id:t,text:a},d)=>{var u;const p=((t,o=e.delay)=>{const a=document.createElement("span");return a.className=r,a.innerText=String(t),a.style.animationDuration=`${e.duration}ms`,a.style.animationDelay=`${o}ms`,a.style.animationName="van-barrage",a.style.animationTimingFunction="linear",a})(a,s.value?d*e.delay:void 0);e.autoPlay||!1!==c.value||(p.style.animationPlayState="paused"),null==(u=n.value)||u.append(p),l.value++;const v=(l.value-1)%+e.rows*p.offsetHeight+ +e.top;p.style.top=`${v}px`,p.dataset.id=String(t),i.push(p),p.addEventListener("animationend",()=>{o("update:modelValue",[...e.modelValue].filter(e=>String(e.id)!==p.dataset.id))})},u=(e,t)=>{const o=new Map(t.map(e=>[e.id,e]));e.forEach((e,t)=>{o.has(e.id)?o.delete(e.id):d(e,t)}),o.forEach(e=>{const t=i.findIndex(t=>t.dataset.id===String(e.id));t>-1&&(i[t].remove(),i.splice(t,1))}),s.value=!1};t.watch(()=>e.modelValue.slice(),(e,t)=>u(null!=e?e:[],null!=t?t:[]),{deep:!0});const p=t.ref({});t.onMounted(()=>{return o=null,a=null,r=function*(){var o;p.value["--move-distance"]=`-${null==(o=n.value)?void 0:o.offsetWidth}px`,yield t.nextTick(),u(e.modelValue,[])},new Promise((e,t)=>{var n=e=>{try{i(r.next(e))}catch(o){t(o)}},l=e=>{try{i(r.throw(e))}catch(o){t(o)}},i=t=>t.done?e(t.value):Promise.resolve(t.value).then(n,l);i((r=r.apply(o,a)).next())});var o,a,r});return ot({play:()=>{c.value=!0,i.forEach(e=>{e.style.animationPlayState="running"})},pause:()=>{c.value=!1,i.forEach(e=>{e.style.animationPlayState="paused"})}}),()=>{var e;return t.createVNode("div",{class:Ir(),ref:n,style:p.value},[null==(e=a.default)?void 0:e.call(a)])}}})),[Er,$r,Lr]=Ie("calendar");function Mr(e,t){const o=e.getFullYear(),a=t.getFullYear();if(o===a){const o=e.getMonth(),a=t.getMonth();return o===a?0:o>a?1:-1}return o>a?1:-1}function Fr(e,t){const o=Mr(e,t);if(0===o){const o=e.getDate(),a=t.getDate();return o===a?0:o>a?1:-1}return o}const Rr=e=>new Date(e),Hr=e=>Array.isArray(e)?e.map(Rr):Rr(e);function jr(e,t){const o=Rr(e);return o.setDate(o.getDate()+t),o}function Wr(e,t){const o=Rr(e);return o.setMonth(o.getMonth()+t),o.getDate()!==e.getDate()&&o.setDate(0),o}function Ur(e,t){const o=Rr(e);return o.setFullYear(o.getFullYear()+t),o.getDate()!==e.getDate()&&o.setDate(0),o}const Yr=e=>jr(e,-1),Xr=e=>jr(e,1),qr=e=>Wr(e,-1),Gr=e=>Wr(e,1),Zr=e=>Ur(e,-1),Kr=e=>Ur(e,1),_r=()=>{const e=new Date;return e.setHours(0,0,0,0),e};const Jr=a({},Va,{modelValue:w(),filter:Function,formatter:{type:Function,default:(e,t)=>t}}),Qr=Object.keys(Va);const el=(e,t)=>32-new Date(e,t-1,32).getDate(),tl=(e,t,o,a,n,r)=>{const l=function(e,t){if(e<0)return[];const o=Array(e);let a=-1;for(;++a<e;)o[a]=t(a);return o}(t-e+1,t=>{const n=ye(e+t);return a(o,{text:n,value:n})});return n?n(o,l,r):l},ol=(e,t)=>e.map((e,o)=>{const a=t[o];if(a.length){const t=+a[0].value,o=+a[a.length-1].value;return ye(we(+e,t,o))}return e}),[al]=Ie("calendar-day");var nl=t.defineComponent({name:al,props:{item:y(Object),color:String,index:Number,offset:x(0),rowHeight:String},emits:["click","clickDisabledDate"],setup(e,{emit:o,slots:a}){const n=t.computed(()=>{const{item:t,index:o,color:a,offset:n,rowHeight:r}=e,l={height:r};if("placeholder"===t.type)return l.width="100%",l;if(0===o&&(l.marginLeft=100*n/7+"%"),a)switch(t.type){case"end":case"start":case"start-end":case"multiple-middle":case"multiple-selected":l.background=a;break;case"middle":l.color=a}return t.date&&function(e,t=0){const o=new Date(e.getFullYear(),e.getMonth()+1,0),a=t+e.getDate()-1,n=t+o.getDate()-1;return Math.floor(a/7)===Math.floor(n/7)}(t.date,n)&&(l.marginBottom=0),l}),r=()=>{"disabled"!==e.item.type?o("click",e.item):o("clickDisabledDate",e.item)},l=()=>{const{topInfo:o}=e.item;if(o||a["top-info"])return t.createVNode("div",{class:$r("top-info")},[a["top-info"]?a["top-info"](e.item):o])},i=()=>{const{bottomInfo:o}=e.item;if(o||a["bottom-info"])return t.createVNode("div",{class:$r("bottom-info")},[a["bottom-info"]?a["bottom-info"](e.item):o])},s=()=>{const{item:o,color:n,rowHeight:r}=e,{type:s}=o,c=[l(),a.text?a.text(e.item):e.item.text,i()];return"selected"===s?t.createVNode("div",{class:$r("selected-day"),style:{width:r,height:r,background:n}},[c]):c};return()=>{const{type:o,className:a}=e.item;return"placeholder"===o?t.createVNode("div",{class:$r("day"),style:n.value},null):t.createVNode("div",{role:"gridcell",style:n.value,class:[$r("day",o),a],tabindex:"disabled"===o?void 0:-1,onClick:r},[s()])}}});const[rl]=Ie("calendar-month"),ll={date:y(Date),type:String,color:String,minDate:Date,maxDate:Date,showMark:Boolean,rowHeight:g,formatter:Function,lazyRender:Boolean,currentDate:[Date,Array],allowSameDay:Boolean,showSubtitle:Boolean,showMonthTitle:Boolean,firstDayOfWeek:Number};var il=t.defineComponent({name:rl,props:ll,emits:["click","clickDisabledDate"],setup(e,{emit:o,slots:a}){const[n,r]=function(e=!1){const o=t.ref(e);return[o,(e=!o.value)=>{o.value=e}]}(),l=t.ref(),i=t.ref(),s=Ze(i),c=t.computed(()=>{return t=e.date,Lr("monthTitle",t.getFullYear(),t.getMonth()+1);var t}),d=t.computed(()=>ue(e.rowHeight)),u=t.computed(()=>{const t=e.date.getDate(),o=(e.date.getDay()-t%7+8)%7;return e.firstDayOfWeek?(o+7-e.firstDayOfWeek)%7:o}),p=t.computed(()=>el(e.date.getFullYear(),e.date.getMonth()+1)),m=t.computed(()=>n.value||!e.lazyRender),f=t=>{const{type:o,minDate:a,maxDate:n,currentDate:r}=e;if(a&&Fr(t,a)<0||n&&Fr(t,n)>0)return"disabled";if(null===r)return"";if(Array.isArray(r)){if("multiple"===o)return(t=>{const o=t=>e.currentDate.some(e=>0===Fr(e,t));if(o(t)){const e=Yr(t),a=Xr(t),n=o(e),r=o(a);return n&&r?"multiple-middle":n?"end":r?"start":"multiple-selected"}return""})(t);if("range"===o)return(t=>{const[o,a]=e.currentDate;if(!o)return"";const n=Fr(t,o);if(!a)return 0===n?"start":"";const r=Fr(t,a);return e.allowSameDay&&0===n&&0===r?"start-end":0===n?"start":0===r?"end":n>0&&r<0?"middle":""})(t)}else if("single"===o)return 0===Fr(t,r)?"selected":"";return""},h=t=>{if("range"===e.type){if("start"===t||"end"===t)return Lr(t);if("start-end"===t)return`${Lr("start")}/${Lr("end")}`}},g=()=>{if(e.showMonthTitle)return t.createVNode("div",{class:$r("month-title")},[a["month-title"]?a["month-title"]({date:e.date,text:c.value}):c.value])},b=()=>{if(e.showMark&&m.value)return t.createVNode("div",{class:$r("month-mark")},[e.date.getMonth()+1])},y=t.computed(()=>{const e=Math.ceil((p.value+u.value)/7);return Array(e).fill({type:"placeholder"})}),w=t.computed(()=>{const t=[],o=e.date.getFullYear(),a=e.date.getMonth();for(let n=1;n<=p.value;n++){const r=new Date(o,a,n),l=f(r);let i={date:r,type:l,text:n,bottomInfo:h(l)};e.formatter&&(i=e.formatter(i)),t.push(i)}return t}),x=t.computed(()=>w.value.filter(e=>"disabled"===e.type)),V=(n,r)=>t.createVNode(nl,{item:n,index:r,color:e.color,offset:u.value,rowHeight:d.value,onClick:e=>o("click",e),onClickDisabledDate:e=>o("clickDisabledDate",e)},v(a,["top-info","bottom-info","text"]));return ot({getTitle:()=>c.value,getHeight:()=>s.value,setVisible:r,scrollToDate:(e,t)=>{if(l.value){const o=P(l.value),a=y.value.length,n=(Math.ceil((t.getDate()+u.value)/7)-1)*o.height/a;Q(e,o.top+n+e.scrollTop-P(e).top)}},disabledDays:x}),()=>t.createVNode("div",{class:$r("month"),ref:i},[g(),t.createVNode("div",{ref:l,role:"grid",class:$r("days")},[b(),(m.value?w:y).value.map(V)])])}});const[sl]=Ie("calendar-header");var cl=t.defineComponent({name:sl,props:{date:Date,minDate:Date,maxDate:Date,title:String,subtitle:String,showTitle:Boolean,showSubtitle:Boolean,firstDayOfWeek:Number,switchMode:N("none")},emits:["clickSubtitle","panelChange"],setup(e,{slots:o,emit:a}){const n=t.computed(()=>e.date&&e.minDate&&Mr(qr(e.date),e.minDate)<0),r=t.computed(()=>e.date&&e.minDate&&Mr(Zr(e.date),e.minDate)<0),l=t.computed(()=>e.date&&e.maxDate&&Mr(Gr(e.date),e.maxDate)>0),i=t.computed(()=>e.date&&e.maxDate&&Mr(Kr(e.date),e.maxDate)>0),s=()=>{if(e.showTitle){const a=e.title||Lr("title"),n=o.title?o.title():a;return t.createVNode("div",{class:$r("header-title")},[n])}},c=e=>a("clickSubtitle",e),d=e=>a("panelChange",e),u=a=>{const s="year-month"===e.switchMode,c=o[a?"next-month":"prev-month"],u=o[a?"next-year":"prev-year"],p=a?l.value:n.value,v=a?i.value:r.value,m=a?"arrow":"arrow-left",f=a?"arrow-double-right":"arrow-double-left",h=t.createVNode("view",{class:$r("header-action",{disabled:p}),onClick:p?void 0:()=>d((a?Gr:qr)(e.date))},[c?c({disabled:p}):t.createVNode(wt,{class:{[je]:!p},name:m},null)]),g=s&&t.createVNode("view",{class:$r("header-action",{disabled:v}),onClick:v?void 0:()=>d((a?Kr:Zr)(e.date))},[u?u({disabled:v}):t.createVNode(wt,{class:{[je]:!v},name:f},null)]);return a?[h,g]:[g,h]},p=()=>{if(e.showSubtitle){const a=o.subtitle?o.subtitle({date:e.date,text:e.subtitle}):e.subtitle,n="none"!==e.switchMode;return t.createVNode("div",{class:$r("header-subtitle",{"with-switch":n}),onClick:c},[n?[u(),t.createVNode("div",{class:$r("header-subtitle-text")},[a]),u(!0)]:a])}},v=()=>{const{firstDayOfWeek:o}=e,a=Lr("weekdays"),n=[...a.slice(o,7),...a.slice(0,o)];return t.createVNode("div",{class:$r("weekdays")},[n.map(e=>t.createVNode("span",{class:$r("weekday")},[e]))])};return()=>t.createVNode("div",{class:$r("header")},[s(),p(),v()])}});const dl={show:Boolean,type:N("single"),switchMode:N("none"),title:String,color:String,round:b,readonly:Boolean,poppable:b,maxRange:V(null),position:N("bottom"),teleport:[String,Object],showMark:b,showTitle:b,formatter:Function,rowHeight:g,confirmText:String,rangePrompt:String,lazyRender:b,showConfirm:b,defaultDate:[Date,Array],allowSameDay:Boolean,showSubtitle:b,closeOnPopstate:b,showRangePrompt:b,confirmDisabledText:String,closeOnClickOverlay:b,safeAreaInsetTop:Boolean,safeAreaInsetBottom:b,minDate:{type:Date,validator:c},maxDate:{type:Date,validator:c},firstDayOfWeek:{type:g,default:0,validator:e=>e>=0&&e<=6}};const ul=Ye(t.defineComponent({name:Er,props:dl,emits:["select","confirm","unselect","monthShow","overRange","update:show","clickSubtitle","clickDisabledDate","clickOverlay","panelChange"],setup(e,{emit:o,slots:a}){const n=t.computed(()=>"none"!==e.switchMode),r=t.computed(()=>e.minDate||n.value?e.minDate:_r()),l=t.computed(()=>e.maxDate||n.value?e.maxDate:Wr(_r(),6)),i=(e,t=r.value,o=l.value)=>t&&-1===Fr(e,t)?t:o&&1===Fr(e,o)?o:e,s=(t=e.defaultDate)=>{const{type:o,allowSameDay:a}=e;if(null===t)return t;const n=_r();if("range"===o){Array.isArray(t)||(t=[]),1===t.length&&1===Fr(t[0],n)&&(t=[]);const e=r.value,o=l.value;return[i(t[0]||n,e,o?a?o:Yr(o):void 0),i(t[1]||(a?n:Xr(n)),e?a?e:Xr(e):void 0)]}return"multiple"===o?Array.isArray(t)?t.map(e=>i(e)):[i(n)]:(t&&!Array.isArray(t)||(t=n),i(t))};let d;const u=t.ref(),p=t.ref(s()),m=t.ref((()=>{const e=Array.isArray(p.value)?p.value[0]:p.value;return e||i(_r())})()),f=t.ref(),[h,g]=Mo(),b=t.computed(()=>e.firstDayOfWeek?+e.firstDayOfWeek%7:0),y=t.computed(()=>{const e=[];if(!r.value||!l.value)return e;const t=new Date(r.value);t.setDate(1);do{e.push(new Date(t)),t.setMonth(t.getMonth()+1)}while(1!==Mr(t,l.value));return e}),w=t.computed(()=>{if(p.value){if("range"===e.type)return!p.value[0]||!p.value[1];if("multiple"===e.type)return!p.value.length}return!p.value}),x=()=>{const e=J(u.value),t=e+d,a=y.value.map((e,t)=>h.value[t].getHeight());if(t>a.reduce((e,t)=>e+t,0)&&e>0)return;let n,r=0;const l=[-1,-1];for(let i=0;i<y.value.length;i++){const s=h.value[i];r<=t&&r+a[i]>=e&&(l[1]=i,n||(n=s,l[0]=i),h.value[i].showed||(h.value[i].showed=!0,o("monthShow",{date:s.date,title:s.getTitle()}))),r+=a[i]}y.value.forEach((e,t)=>{const o=t>=l[0]-1&&t<=l[1]+1;h.value[t].setVisible(o)}),n&&(f.value=n)},V=e=>{n.value?m.value=e:k(()=>{y.value.some((t,o)=>0===Mr(t,e)&&(u.value&&h.value[o].scrollToDate(u.value,e),!0)),x()})},N=()=>{if(!e.poppable||e.show)if(p.value){const t="single"===e.type?p.value:p.value[0];c(t)&&V(t)}else n.value||k(x)},C=()=>{e.poppable&&!e.show||(n.value||k(()=>{d=Math.floor(P(u).height)}),N())},S=(e=s())=>{p.value=e,N()},T=e=>{m.value=e,o("panelChange",{date:e})},B=()=>{var e;return o("confirm",null!=(e=p.value)?e:Hr(p.value))},D=(t,a)=>{const n=e=>{p.value=e,o("select",Hr(e))};if(a&&"range"===e.type){const a=(t=>{const{maxRange:a,rangePrompt:n,showRangePrompt:r}=e;return!(a&&function(e){const t=e[0].getTime();return(e[1].getTime()-t)/864e5+1}(t)>+a&&(r&&gn(n||Lr("rangePrompt",a)),o("overRange"),1))})(t);if(!a)return void n([t[0],jr(t[0],+e.maxRange-1)])}n(t),a&&!e.showConfirm&&B()},O=t.computed(()=>h.value.reduce((e,t)=>{var o,a;return e.push(...null!=(a=null==(o=t.disabledDays)?void 0:o.value)?a:[]),e},[])),A=t=>{if(e.readonly||!t.date)return;const{date:a}=t,{type:n}=e;if("range"===n){if(!p.value)return void D([a]);const[t,o]=p.value;if(t&&!o){const o=Fr(a,t);if(1===o){const e=((e,t,o)=>{var a;return null==(a=e.find(e=>-1===Fr(t,e.date)&&-1===Fr(e.date,o)))?void 0:a.date})(O.value,t,a);if(e){const o=Yr(e);-1===Fr(t,o)?D([t,o]):D([a])}else D([t,a],!0)}else-1===o?D([a]):e.allowSameDay&&D([a,a],!0)}else D([a])}else if("multiple"===n){if(!p.value)return void D([a]);const t=p.value,n=t.findIndex(e=>0===Fr(e,a));if(-1!==n){const[e]=t.splice(n,1);o("unselect",Rr(e))}else e.maxRange&&t.length>=+e.maxRange?gn(e.rangePrompt||Lr("rangePrompt",e.maxRange)):D([...t,a])}else D(a,!0)},I=e=>o("clickOverlay",e),z=e=>o("update:show",e),E=(i,s)=>{const c=0!==s||!e.showSubtitle;return t.createVNode(il,t.mergeProps({ref:n.value?f:g(s),date:i,currentDate:p.value,showMonthTitle:c,firstDayOfWeek:b.value,lazyRender:!n.value&&e.lazyRender,maxDate:l.value,minDate:r.value},v(e,["type","color","showMark","formatter","rowHeight","showSubtitle","allowSameDay"]),{onClick:A,onClickDisabledDate:e=>o("clickDisabledDate",e)}),v(a,["top-info","bottom-info","month-title","text"]))},$=()=>{if(a.footer)return a.footer();if(e.showConfirm){const o=a["confirm-text"],n=w.value,r=n?e.confirmDisabledText:e.confirmText;return t.createVNode(Ot,{round:!0,block:!0,type:"primary",color:e.color,class:$r("confirm"),disabled:n,nativeType:"button",onClick:B},{default:()=>[o?o({disabled:n}):r||Lr("confirm")]})}},L=()=>{var i,s;return t.createVNode("div",{class:$r()},[t.createVNode(cl,{date:null==(i=f.value)?void 0:i.date,maxDate:l.value,minDate:r.value,title:e.title,subtitle:null==(s=f.value)?void 0:s.getTitle(),showTitle:e.showTitle,showSubtitle:e.showSubtitle,switchMode:e.switchMode,firstDayOfWeek:b.value,onClickSubtitle:e=>o("clickSubtitle",e),onPanelChange:T},v(a,["title","subtitle","prev-month","prev-year","next-month","next-year"])),t.createVNode("div",{ref:u,class:$r("body"),onScroll:n.value?void 0:x},[n.value?E(m.value,0):y.value.map(E)]),t.createVNode("div",{class:[$r("footer"),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[$()])])};return t.watch(()=>e.show,C),t.watch(()=>[e.type,e.minDate,e.maxDate,e.switchMode],()=>S(s(p.value))),t.watch(()=>e.defaultDate,e=>{S(e)}),ot({reset:S,scrollToDate:V,getSelectedDate:()=>p.value}),F(C),()=>e.poppable?t.createVNode(to,{show:e.show,class:$r("popup"),round:e.round,position:e.position,closeable:e.showTitle||e.showSubtitle,teleport:e.teleport,closeOnPopstate:e.closeOnPopstate,safeAreaInsetTop:e.safeAreaInsetTop,closeOnClickOverlay:e.closeOnClickOverlay,onClickOverlay:I,"onUpdate:show":z},{default:L}):L()}})),[pl,vl]=Ie("image"),ml={src:String,alt:String,fit:String,position:String,round:Boolean,block:Boolean,width:g,height:g,radius:g,lazyLoad:Boolean,iconSize:g,showError:b,errorIcon:N("photo-fail"),iconPrefix:String,showLoading:b,loadingIcon:N("photo"),crossorigin:String,referrerpolicy:String,decoding:String};const fl=Ye(t.defineComponent({name:pl,props:ml,emits:["load","error"],setup(e,{emit:o,slots:a}){const r=t.ref(!1),i=t.ref(!0),s=t.ref(),{$Lazyload:c}=t.getCurrentInstance().proxy,d=t.computed(()=>{const t={width:ue(e.width),height:ue(e.height)};return l(e.radius)&&(t.overflow="hidden",t.borderRadius=ue(e.radius)),t});t.watch(()=>e.src,()=>{r.value=!1,i.value=!0});const u=e=>{i.value&&(i.value=!1,o("load",e))},p=()=>{const e=new Event("load");Object.defineProperty(e,"target",{value:s.value,enumerable:!0}),u(e)},v=e=>{r.value=!0,i.value=!1,o("error",e)},m=(o,a,n)=>n?n():t.createVNode(wt,{name:o,size:e.iconSize,class:a,classPrefix:e.iconPrefix},null),f=()=>{if(r.value||!e.src)return;const o={alt:e.alt,class:vl("img"),decoding:e.decoding,style:{objectFit:e.fit,objectPosition:e.position},crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy};return e.lazyLoad?t.withDirectives(t.createVNode("img",t.mergeProps({ref:s},o),null),[[t.resolveDirective("lazy"),e.src]]):t.createVNode("img",t.mergeProps({ref:s,src:e.src,onLoad:u,onError:v},o),null)},h=({el:e})=>{const o=()=>{e===s.value&&i.value&&p()};s.value?o():t.nextTick(o)},g=({el:e})=>{e!==s.value||r.value||v()};return c&&n&&(c.$on("loaded",h),c.$on("error",g),t.onBeforeUnmount(()=>{c.$off("loaded",h),c.$off("error",g)})),t.onMounted(()=>{t.nextTick(()=>{var t;(null==(t=s.value)?void 0:t.complete)&&!e.lazyLoad&&p()})}),()=>{var o;return t.createVNode("div",{class:vl({round:e.round,block:e.block}),style:d.value},[f(),i.value&&e.showLoading?t.createVNode("div",{class:vl("loading")},[m(e.loadingIcon,vl("loading-icon"),a.loading)]):r.value&&e.showError?t.createVNode("div",{class:vl("error")},[m(e.errorIcon,vl("error-icon"),a.error)]):void 0,null==(o=a.default)?void 0:o.call(a)])}}})),[hl,gl]=Ie("card"),bl={tag:String,num:g,desc:String,thumb:String,title:String,price:g,centered:Boolean,lazyLoad:Boolean,currency:N("¥"),thumbLink:String,originPrice:g};const yl=Ye(t.defineComponent({name:hl,props:bl,emits:["clickThumb"],setup(e,{slots:o,emit:a}){const n=()=>{if(o.tag||e.tag)return t.createVNode("div",{class:gl("tag")},[o.tag?o.tag():t.createVNode(Kn,{mark:!0,type:"primary"},{default:()=>[e.tag]})])},r=()=>{if(o.thumb||e.thumb)return t.createVNode("a",{href:e.thumbLink,class:gl("thumb"),onClick:e=>a("clickThumb",e)},[o.thumb?o.thumb():t.createVNode(fl,{src:e.thumb,fit:"cover",width:"100%",height:"100%",lazyLoad:e.lazyLoad},null),n()])},i=()=>{const o=e.price.toString().split(".");return t.createVNode("div",null,[t.createVNode("span",{class:gl("price-currency")},[e.currency]),t.createVNode("span",{class:gl("price-integer")},[o[0]]),o.length>1&&t.createVNode(t.Fragment,null,[t.createTextVNode("."),t.createVNode("span",{class:gl("price-decimal")},[o[1]])])])};return()=>{var a,n,s;const c=o.num||l(e.num),d=o.price||l(e.price),u=o["origin-price"]||l(e.originPrice),p=c||d||u||o.bottom,v=d&&t.createVNode("div",{class:gl("price")},[o.price?o.price():i()]),m=u&&t.createVNode("div",{class:gl("origin-price")},[o["origin-price"]?o["origin-price"]():`${e.currency} ${e.originPrice}`]),f=c&&t.createVNode("div",{class:gl("num")},[o.num?o.num():`x${e.num}`]),h=o.footer&&t.createVNode("div",{class:gl("footer")},[o.footer()]),g=p&&t.createVNode("div",{class:gl("bottom")},[null==(a=o["price-top"])?void 0:a.call(o),v,m,f,null==(n=o.bottom)?void 0:n.call(o)]);return t.createVNode("div",{class:gl()},[t.createVNode("div",{class:gl("header")},[r(),t.createVNode("div",{class:gl("content",{centered:e.centered})},[t.createVNode("div",null,[o.title?o.title():e.title?t.createVNode("div",{class:[gl("title"),"van-multi-ellipsis--l2"]},[e.title]):void 0,o.desc?o.desc():e.desc?t.createVNode("div",{class:[gl("desc"),"van-ellipsis"]},[e.desc]):void 0,null==(s=o.tags)?void 0:s.call(o)]),g])]),h])}}})),[wl,xl,Vl]=Ie("cascader"),Nl={title:String,options:w(),closeable:b,swipeable:b,closeIcon:N("cross"),showHeader:b,modelValue:g,fieldNames:Object,placeholder:String,activeColor:String};const Cl=Ye(t.defineComponent({name:wl,props:Nl,emits:["close","change","finish","clickTab","update:modelValue"],setup(e,{slots:o,emit:n}){const r=t.ref([]),l=t.ref(0),[i,s]=Mo(),{text:c,value:d,children:u}=a({text:"text",value:"value",children:"children"},e.fieldNames),p=(e,t)=>{for(const o of e){if(o[d]===t)return[o];if(o[u]){const e=p(o[u],t);if(e)return[o,...e]}}},v=()=>{const{options:o,modelValue:a}=e;if(void 0!==a){const e=p(o,a);if(e){let a=o;return r.value=e.map(e=>{const t={options:a,selected:e},o=a.find(t=>t[d]===e[d]);return o&&(a=o[u]),t}),a&&r.value.push({options:a,selected:null}),void t.nextTick(()=>{l.value=r.value.length-1})}}r.value=[{options:o,selected:null}]},m=()=>n("close"),f=({name:e,title:t})=>n("clickTab",e,t),h=(a,i,p)=>{const{disabled:v}=a,m=!(!i||a[d]!==i[d]),f=a.color||(m?e.activeColor:void 0),h=o.option?o.option({option:a,selected:m}):t.createVNode("span",null,[a[c]]);return t.createVNode("li",{ref:m?s(p):void 0,role:"menuitemradio",class:[xl("option",{selected:m,disabled:v}),a.className],style:{color:f},tabindex:v?void 0:m?0:-1,"aria-checked":m,"aria-disabled":v||void 0,onClick:()=>((e,o)=>{if(e.disabled)return;if(r.value[o].selected=e,r.value.length>o+1&&(r.value=r.value.slice(0,o+1)),e[u]){const a={options:e[u],selected:null};r.value[o+1]?r.value[o+1]=a:r.value.push(a),t.nextTick(()=>{l.value++})}const a=r.value.map(e=>e.selected).filter(Boolean);n("update:modelValue",e[d]);const i={value:e[d],tabIndex:o,selectedOptions:a};n("change",i),e[u]||n("finish",i)})(a,p)},[h,m?t.createVNode(wt,{name:"success",class:xl("selected-icon")},null):null])},g=(e,o,a)=>t.createVNode("ul",{role:"menu",class:xl("options")},[e.map(e=>h(e,o,a))]),b=(a,n)=>{const{options:r,selected:l}=a,i=e.placeholder||Vl("select"),s=l?l[c]:i;return t.createVNode(fa,{title:s,titleClass:xl("tab",{unselected:!l})},{default:()=>{var e,t;return[null==(e=o["options-top"])?void 0:e.call(o,{tabIndex:n}),g(r,l,n),null==(t=o["options-bottom"])?void 0:t.call(o,{tabIndex:n})]}})};return v(),t.watch(l,e=>{const t=i.value[e];t&&(e=>{const t=e.parentElement;t&&(t.scrollTop=e.offsetTop-(t.offsetHeight-e.offsetHeight)/2)})(t)}),t.watch(()=>e.options,v,{deep:!0}),t.watch(()=>e.modelValue,e=>{if(void 0!==e){if(r.value.map(e=>{var t;return null==(t=e.selected)?void 0:t[d]}).includes(e))return}v()}),()=>t.createVNode("div",{class:xl()},[e.showHeader?t.createVNode("div",{class:xl("header")},[t.createVNode("h2",{class:xl("title")},[o.title?o.title():e.title]),e.closeable?t.createVNode(wt,{name:e.closeIcon,class:[xl("close-icon"),je],onClick:m},null):null]):null,t.createVNode(ha,{active:l.value,"onUpdate:active":e=>l.value=e,shrink:!0,animated:!0,class:xl("tabs"),color:e.activeColor,swipeable:e.swipeable,onClickTab:f},{default:()=>[r.value.map(b)]})])}})),[kl,Sl]=Ie("cell-group"),Tl={title:String,inset:Boolean,border:b};const Bl=Ye(t.defineComponent({name:kl,inheritAttrs:!1,props:Tl,setup(e,{slots:o,attrs:a}){const n=()=>{var n;return t.createVNode("div",t.mergeProps({class:[Sl({inset:e.inset}),{[Re]:e.border&&!e.inset}]},a,qt()),[null==(n=o.default)?void 0:n.call(o)])};return()=>e.title||o.title?t.createVNode(t.Fragment,null,[t.createVNode("div",{class:Sl("title",{inset:e.inset})},[o.title?o.title():e.title]),n()]):n()}})),[Pl,Dl]=Ie("circle");let Ol=0;const Al=e=>Math.min(Math.max(+e,0),100);const Il={text:String,size:g,fill:N("none"),rate:V(100),speed:V(0),color:[String,Object],clockwise:b,layerColor:String,currentRate:x(0),strokeWidth:V(40),strokeLinecap:String,startPosition:N("top")};const zl=Ye(t.defineComponent({name:Pl,props:Il,emits:["update:currentRate"],setup(e,{emit:o,slots:a}){const n="van-circle-"+Ol++,l=t.computed(()=>+e.strokeWidth+1e3),i=t.computed(()=>function(e,t){const o=e?1:0;return`M ${t/2} ${t/2} m 0, -500 a 500, 500 0 1, ${o} 0, 1000 a 500, 500 0 1, ${o} 0, -1000`}(e.clockwise,l.value)),s=t.computed(()=>{const t={top:0,right:90,bottom:180,left:270}[e.startPosition];if(t)return{transform:`rotate(${t}deg)`}});t.watch(()=>e.rate,t=>{let a;const n=Date.now(),r=e.currentRate,l=Al(t),i=Math.abs(1e3*(r-l)/+e.speed),s=()=>{const e=Date.now(),t=Math.min((e-n)/i,1)*(l-r)+r;o("update:currentRate",Al(parseFloat(t.toFixed(1)))),(l>r?t<l:t>l)&&(a=k(s))};e.speed?(a&&S(a),a=k(s)):o("update:currentRate",l)},{immediate:!0});const c=()=>{const{strokeWidth:o,currentRate:a,strokeLinecap:l}=e,s=3140*a/100,c=r(e.color)?`url(#${n})`:e.color,d={stroke:c,strokeWidth:+o+1+"px",strokeLinecap:l,strokeDasharray:`${s}px 3140px`};return t.createVNode("path",{d:i.value,style:d,class:Dl("hover"),stroke:c},null)},d=()=>{const o={fill:e.fill,stroke:e.layerColor,strokeWidth:`${e.strokeWidth}px`};return t.createVNode("path",{class:Dl("layer"),style:o,d:i.value},null)},u=()=>{const{color:o}=e;if(!r(o))return;const a=Object.keys(o).sort((e,t)=>parseFloat(e)-parseFloat(t)).map((e,a)=>t.createVNode("stop",{key:a,offset:e,"stop-color":o[e]},null));return t.createVNode("defs",null,[t.createVNode("linearGradient",{id:n,x1:"100%",y1:"0%",x2:"0%",y2:"0%"},[a])])};return()=>t.createVNode("div",{class:Dl(),style:pe(e.size)},[t.createVNode("svg",{viewBox:`0 0 ${l.value} ${l.value}`,style:s.value},[u(),d(),c()]),a.default?a.default():e.text?t.createVNode("div",{class:Dl("text")},[e.text]):void 0])}})),[El,$l]=Ie("row"),Ll=Symbol(El),Ml={tag:N("div"),wrap:b,align:String,gutter:{type:[String,Number,Array],default:0},justify:String};var Fl=t.defineComponent({name:El,props:Ml,setup(e,{slots:o}){const{children:a,linkChildren:n}=I(Ll),r=t.computed(()=>{const e=[[]];let t=0;return a.forEach((o,a)=>{t+=Number(o.span),t>24?(e.push([a]),t-=24):e[e.length-1].push(a)}),e});return n({spaces:t.computed(()=>{let t=0;t=Array.isArray(e.gutter)?Number(e.gutter[0])||0:Number(e.gutter);const o=[];return t?(r.value.forEach(e=>{const a=t*(e.length-1)/e.length;e.forEach((e,n)=>{if(0===n)o.push({right:a});else{const n=t-o[e-1].right,r=a-n;o.push({left:n,right:r})}})}),o):o}),verticalSpaces:t.computed(()=>{const{gutter:t}=e,o=[];if(Array.isArray(t)&&t.length>1){const e=Number(t[1])||0;if(e<=0)return o;r.value.forEach((t,a)=>{a!==r.value.length-1&&t.forEach(()=>{o.push({bottom:e})})})}return o})}),()=>{const{tag:a,wrap:n,align:r,justify:l}=e;return t.createVNode(a,{class:$l({[`align-${r}`]:r,[`justify-${l}`]:l,nowrap:!n})},{default:()=>{var e;return[null==(e=o.default)?void 0:e.call(o)]}})}}});const[Rl,Hl]=Ie("col"),jl={tag:N("div"),span:V(0),offset:g};const Wl=Ye(t.defineComponent({name:Rl,props:jl,setup(e,{slots:o}){const{parent:n,index:r}=D(Ll),l=t.computed(()=>{if(!n)return;const{spaces:e,verticalSpaces:t}=n;let o={};if(e&&e.value&&e.value[r.value]){const{left:t,right:a}=e.value[r.value];o={paddingLeft:t?`${t}px`:null,paddingRight:a?`${a}px`:null}}const{bottom:l}=t.value[r.value]||{};return a(o,{marginBottom:l?`${l}px`:null})});return()=>{const{tag:a,span:n,offset:r}=e;return t.createVNode(a,{style:l.value,class:Hl({[n]:n,[`offset-${r}`]:r})},{default:()=>{var e;return[null==(e=o.default)?void 0:e.call(o)]}})}}})),[Ul,Yl]=Ie("collapse"),Xl=Symbol(Ul),ql={border:b,accordion:Boolean,modelValue:{type:[String,Number,Array],default:""}};const Gl=Ye(t.defineComponent({name:Ul,props:ql,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const{linkChildren:n,children:r}=I(Xl),l=e=>{o("change",e),o("update:modelValue",e)};return ot({toggleAll:(t={})=>{if(e.accordion)return;"boolean"==typeof t&&(t={expanded:t});const{expanded:o,skipDisabled:a}=t,n=r.filter(e=>e.disabled&&a?e.expanded.value:null!=o?o:!e.expanded.value).map(e=>e.itemName.value);l(n)}}),n({toggle:(t,o)=>{const{accordion:a,modelValue:n}=e;l(a?t===n?"":t:o?n.concat(t):n.filter(e=>e!==t))},isExpanded:t=>{const{accordion:o,modelValue:a}=e;return o?a===t:a.includes(t)}}),()=>{var o;return t.createVNode("div",{class:[Yl(),{[Re]:e.border}]},[null==(o=a.default)?void 0:o.call(a)])}}})),[Zl,Kl]=Ie("collapse-item"),_l=["icon","title","value","label","right-icon"],Jl=a({},La,{name:g,isLink:b,disabled:Boolean,readonly:Boolean,lazyRender:b});const Ql=Ye(t.defineComponent({name:Zl,props:Jl,setup(e,{slots:o}){const a=t.ref(),n=t.ref(),{parent:r,index:l}=D(Xl);if(!r)return;const i=t.computed(()=>{var t;return null!=(t=e.name)?t:l.value}),s=t.computed(()=>r.isExpanded(i.value)),c=t.ref(s.value),d=Xt(()=>c.value||!e.lazyRender),u=()=>{s.value?a.value&&(a.value.style.height=""):c.value=!1};t.watch(s,(e,o)=>{if(null===o)return;e&&(c.value=!0);(e?t.nextTick:k)(()=>{if(!n.value||!a.value)return;const{offsetHeight:t}=n.value;if(t){const o=`${t}px`;a.value.style.height=e?"0":o,T(()=>{a.value&&(a.value.style.height=e?o:"0")})}else u()})});const p=(e=!s.value)=>{r.toggle(i.value,e)},m=()=>{e.disabled||e.readonly||p()},f=()=>{const{border:a,disabled:n,readonly:r}=e,l=v(e,Object.keys(La));return r&&(l.isLink=!1),(n||r)&&(l.clickable=!1),t.createVNode(Fa,t.mergeProps({role:"button",class:Kl("title",{disabled:n,expanded:s.value,borderless:!a}),"aria-expanded":String(s.value),onClick:m},l),v(o,_l))},h=d(()=>{var e;return t.withDirectives(t.createVNode("div",{ref:a,class:Kl("wrapper"),onTransitionend:u},[t.createVNode("div",{ref:n,class:Kl("content")},[null==(e=o.default)?void 0:e.call(o)])]),[[t.vShow,c.value]])});return ot({toggle:p,expanded:s,itemName:i}),()=>t.createVNode("div",{class:[Kl({border:l.value&&e.border})]},[f(),h()])}})),ei=Ye(ht),[ti,oi,ai]=Ie("contact-card"),ni={tel:String,name:String,type:N("add"),addText:String,editable:b};const ri=Ye(t.defineComponent({name:ti,props:ni,emits:["click"],setup(e,{emit:o}){const a=t=>{e.editable&&o("click",t)},n=()=>"add"===e.type?e.addText||ai("addContact"):[t.createVNode("div",null,[`${ai("name")}：${e.name}`]),t.createVNode("div",null,[`${ai("tel")}：${e.tel}`])];return()=>t.createVNode(Fa,{center:!0,icon:"edit"===e.type?"contact":"add-square",class:oi([e.type]),border:!1,isLink:e.editable,titleClass:oi("title"),onClick:a},{title:n})}})),[li,ii,si]=Ie("contact-edit"),ci={tel:"",name:""},di={isEdit:Boolean,isSaving:Boolean,isDeleting:Boolean,showSetDefault:Boolean,setDefaultLabel:String,contactInfo:{type:Object,default:()=>a({},ci)},telValidator:{type:Function,default:d}};const ui=Ye(t.defineComponent({name:li,props:di,emits:["save","delete","changeDefault"],setup(e,{emit:o}){const n=t.reactive(a({},ci,e.contactInfo)),r=()=>{e.isSaving||o("save",n)},l=()=>o("delete",n),i=()=>t.createVNode(Sn,{modelValue:n.isDefault,"onUpdate:modelValue":e=>n.isDefault=e,onChange:e=>o("changeDefault",e)},null),s=()=>{if(e.showSetDefault)return t.createVNode(Fa,{title:e.setDefaultLabel,class:ii("switch-cell"),border:!1},{"right-icon":i})};return t.watch(()=>e.contactInfo,e=>a(n,ci,e)),()=>t.createVNode(Wa,{class:ii(),onSubmit:r},{default:()=>[t.createVNode("div",{class:ii("fields")},[t.createVNode(en,{modelValue:n.name,"onUpdate:modelValue":e=>n.name=e,clearable:!0,label:si("name"),rules:[{required:!0,message:si("nameEmpty")}],maxlength:"30",placeholder:si("name")},null),t.createVNode(en,{modelValue:n.tel,"onUpdate:modelValue":e=>n.tel=e,clearable:!0,type:"tel",label:si("tel"),rules:[{validator:e.telValidator,message:si("telInvalid")}],placeholder:si("tel")},null)]),s(),t.createVNode("div",{class:ii("buttons")},[t.createVNode(Ot,{block:!0,round:!0,type:"primary",text:si("save"),class:ii("button"),loading:e.isSaving,nativeType:"submit"},null),e.isEdit&&t.createVNode(Ot,{block:!0,round:!0,text:si("delete"),class:ii("button"),loading:e.isDeleting,onClick:l},null)])]})}})),[pi,vi,mi]=Ie("contact-list"),fi={list:Array,addText:String,modelValue:h,defaultTagText:String};const hi=Ye(t.defineComponent({name:pi,props:fi,emits:["add","edit","select","update:modelValue"],setup(e,{emit:o}){const a=(a,n)=>t.createVNode(Fa,{key:a.id,isLink:!0,center:!0,class:vi("item"),titleClass:vi("item-title"),onClick:()=>{o("update:modelValue",a.id),o("select",a,n)}},{icon:()=>t.createVNode(wt,{name:"edit",class:vi("edit"),onClick:e=>{e.stopPropagation(),o("edit",a,n)}},null),title:()=>{const o=[`${a.name}，${a.tel}`];return a.isDefault&&e.defaultTagText&&o.push(t.createVNode(Kn,{type:"primary",round:!0,class:vi("item-tag")},{default:()=>[e.defaultTagText]})),o},"right-icon":()=>t.createVNode(or,{class:vi("radio"),name:a.id,iconSize:18},null)});return()=>t.createVNode("div",{class:vi()},[t.createVNode(Hn,{modelValue:e.modelValue,class:vi("group")},{default:()=>[e.list&&e.list.map(a)]}),t.createVNode("div",{class:[vi("bottom"),"van-safe-area-bottom"]},[t.createVNode(Ot,{round:!0,block:!0,type:"primary",class:vi("add"),text:e.addText||mi("addContact"),onClick:()=>o("add")},null)])])}}));const[gi,bi]=Ie("count-down"),yi={time:V(0),format:N("HH:mm:ss"),autoStart:b,millisecond:Boolean};const wi=Ye(t.defineComponent({name:gi,props:yi,emits:["change","finish"],setup(e,{emit:o,slots:a}){const{start:n,pause:r,reset:l,current:i}=M({time:+e.time,millisecond:e.millisecond,onChange:e=>o("change",e),onFinish:()=>o("finish")}),s=t.computed(()=>function(e,t){const{days:o}=t;let{hours:a,minutes:n,seconds:r,milliseconds:l}=t;if(e.includes("DD")?e=e.replace("DD",ye(o)):a+=24*o,e.includes("HH")?e=e.replace("HH",ye(a)):n+=60*a,e.includes("mm")?e=e.replace("mm",ye(n)):r+=60*n,e.includes("ss")?e=e.replace("ss",ye(r)):l+=1e3*r,e.includes("S")){const t=ye(l,3);e=e.includes("SSS")?e.replace("SSS",t):e.includes("SS")?e.replace("SS",t.slice(0,2)):e.replace("S",t.charAt(0))}return e}(e.format,i.value)),c=()=>{l(+e.time),e.autoStart&&n()};return t.watch(()=>e.time,c,{immediate:!0}),ot({start:n,pause:r,reset:c}),()=>t.createVNode("div",{role:"timer",class:bi()},[a.default?a.default(i.value):s.value])}}));function xi(e){const t=new Date(1e3*e);return`${t.getFullYear()}.${ye(t.getMonth()+1)}.${ye(t.getDate())}`}const Vi=e=>(e/100).toFixed(e%100==0?0:e%10==0?1:2),[Ni,Ci,ki]=Ie("coupon");const Si=Ye(t.defineComponent({name:Ni,props:{chosen:Boolean,coupon:y(Object),disabled:Boolean,currency:N("¥")},setup(e){const o=t.computed(()=>{const{startAt:t,endAt:o}=e.coupon;return`${xi(t)} - ${xi(o)}`}),a=t.computed(()=>{const{coupon:o,currency:a}=e;if(o.valueDesc)return[o.valueDesc,t.createVNode("span",null,[o.unitDesc||""])];if(o.denominations){const e=Vi(o.denominations);return[t.createVNode("span",null,[a]),` ${e}`]}return o.discount?ki("discount",((n=o.discount)/10).toFixed(n%10==0?0:1)):"";var n}),n=t.computed(()=>{const t=Vi(e.coupon.originCondition||0);return"0"===t?ki("unlimited"):ki("condition",t)});return()=>{const{chosen:r,coupon:l,disabled:i}=e,s=i&&l.reason||l.description;return t.createVNode("div",{class:Ci({disabled:i})},[t.createVNode("div",{class:Ci("content")},[t.createVNode("div",{class:Ci("head")},[t.createVNode("h2",{class:Ci("amount")},[a.value]),t.createVNode("p",{class:Ci("condition")},[l.condition||n.value])]),t.createVNode("div",{class:Ci("body")},[t.createVNode("p",{class:Ci("name")},[l.name]),t.createVNode("p",{class:Ci("valid")},[o.value]),!i&&t.createVNode(lr,{class:Ci("corner"),modelValue:r},null)])]),s&&t.createVNode("p",{class:Ci("description")},[s])])}}})),[Ti,Bi,Pi]=Ie("coupon-cell"),Di={title:String,border:b,editable:b,coupons:w(),currency:N("¥"),chosenCoupon:{type:[Number,Array],default:-1}};function Oi({coupons:e,chosenCoupon:t,currency:o}){let a=0,n=!1;return(Array.isArray(t)?t:[t]).forEach(t=>{const o=e[+t];o&&(n=!0,a+=(e=>{const{value:t,denominations:o}=e;return l(t)?t:l(o)?o:0})(o))}),n?`-${o} ${(a/100).toFixed(2)}`:0===e.length?Pi("noCoupon"):Pi("count",e.length)}const Ai=Ye(t.defineComponent({name:Ti,props:Di,setup:e=>()=>{const o=Array.isArray(e.chosenCoupon)?e.chosenCoupon.length:e.coupons[+e.chosenCoupon];return t.createVNode(Fa,{class:Bi(),value:Oi(e),title:e.title||Pi("title"),border:e.border,isLink:e.editable,valueClass:Bi("value",{selected:o})},null)}})),[Ii,zi]=Ie("empty"),Ei={image:N("default"),imageSize:[Number,String,Array],description:String};const $i=Ye(t.defineComponent({name:Ii,props:Ei,setup(e,{slots:o}){const a=()=>{const a=o.description?o.description():e.description;if(a)return t.createVNode("p",{class:zi("description")},[a])},n=()=>{if(o.default)return t.createVNode("div",{class:zi("bottom")},[o.default()])},r=Lo(),l=e=>`${r}-${e}`,i=e=>`url(#${l(e)})`,s=(e,o,a)=>t.createVNode("stop",{"stop-color":e,offset:`${o}%`,"stop-opacity":a},null),c=(e,t)=>[s(e,0),s(t,100)],d=e=>[t.createVNode("defs",null,[t.createVNode("radialGradient",{id:l(e),cx:"50%",cy:"54%",fx:"50%",fy:"54%",r:"297%",gradientTransform:"matrix(-.16 0 0 -.33 .58 .72)","data-allow-mismatch":"attribute"},[s("#EBEDF0",0),s("#F2F3F5",100,.3)])]),t.createVNode("ellipse",{fill:i(e),opacity:".8",cx:"80",cy:"140",rx:"46",ry:"8","data-allow-mismatch":"attribute"},null)],u=()=>[t.createVNode("defs",null,[t.createVNode("linearGradient",{id:l("a"),x1:"64%",y1:"100%",x2:"64%","data-allow-mismatch":"attribute"},[s("#FFF",0,.5),s("#F2F3F5",100)])]),t.createVNode("g",{opacity:".8","data-allow-mismatch":"children"},[t.createVNode("path",{d:"M36 131V53H16v20H2v58h34z",fill:i("a")},null),t.createVNode("path",{d:"M123 15h22v14h9v77h-31V15z",fill:i("a")},null)])],p=()=>[t.createVNode("defs",null,[t.createVNode("linearGradient",{id:l("b"),x1:"64%",y1:"97%",x2:"64%",y2:"0%","data-allow-mismatch":"attribute"},[s("#F2F3F5",0,.3),s("#F2F3F5",100)])]),t.createVNode("g",{opacity:".8","data-allow-mismatch":"children"},[t.createVNode("path",{d:"M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",fill:i("b")},null),t.createVNode("path",{d:"M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",fill:i("b")},null)])],v=()=>t.createVNode("svg",{viewBox:"0 0 160 160"},[t.createVNode("defs",{"data-allow-mismatch":"children"},[t.createVNode("linearGradient",{id:l(1),x1:"64%",y1:"100%",x2:"64%"},[s("#FFF",0,.5),s("#F2F3F5",100)]),t.createVNode("linearGradient",{id:l(2),x1:"50%",x2:"50%",y2:"84%"},[s("#EBEDF0",0),s("#DCDEE0",100,0)]),t.createVNode("linearGradient",{id:l(3),x1:"100%",x2:"100%",y2:"100%"},[c("#EAEDF0","#DCDEE0")]),t.createVNode("radialGradient",{id:l(4),cx:"50%",cy:"0%",fx:"50%",fy:"0%",r:"100%",gradientTransform:"matrix(0 1 -.54 0 .5 -.5)"},[s("#EBEDF0",0),s("#FFF",100,0)])]),t.createVNode("g",{fill:"none"},[u(),t.createVNode("path",{fill:i(4),d:"M0 139h160v21H0z","data-allow-mismatch":"attribute"},null),t.createVNode("path",{d:"M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",fill:i(2),"data-allow-mismatch":"attribute"},null),t.createVNode("g",{opacity:".6","stroke-linecap":"round","stroke-width":"7","data-allow-mismatch":"children"},[t.createVNode("path",{d:"M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",stroke:i(3)},null),t.createVNode("path",{d:"M53 36a34 34 0 0 0 0 48",stroke:i(3)},null),t.createVNode("path",{d:"M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",stroke:i(3)},null),t.createVNode("path",{d:"M106 84a34 34 0 0 0 0-48",stroke:i(3)},null)]),t.createVNode("g",{transform:"translate(31 105)"},[t.createVNode("rect",{fill:"#EBEDF0",width:"98",height:"34",rx:"2"},null),t.createVNode("rect",{fill:"#FFF",x:"9",y:"8",width:"80",height:"18",rx:"1.1"},null),t.createVNode("rect",{fill:"#EBEDF0",x:"15",y:"12",width:"18",height:"6",rx:"1.1"},null)])])]),m=()=>t.createVNode("svg",{viewBox:"0 0 160 160"},[t.createVNode("defs",{"data-allow-mismatch":"children"},[t.createVNode("linearGradient",{x1:"50%",x2:"50%",y2:"100%",id:l(5)},[c("#F2F3F5","#DCDEE0")]),t.createVNode("linearGradient",{x1:"95%",y1:"48%",x2:"5.5%",y2:"51%",id:l(6)},[c("#EAEDF1","#DCDEE0")]),t.createVNode("linearGradient",{y1:"45%",x2:"100%",y2:"54%",id:l(7)},[c("#EAEDF1","#DCDEE0")])]),u(),p(),t.createVNode("g",{transform:"translate(36 50)",fill:"none"},[t.createVNode("g",{transform:"translate(8)"},[t.createVNode("rect",{fill:"#EBEDF0",opacity:".6",x:"38",y:"13",width:"36",height:"53",rx:"2"},null),t.createVNode("rect",{fill:i(5),width:"64",height:"66",rx:"2","data-allow-mismatch":"attribute"},null),t.createVNode("rect",{fill:"#FFF",x:"6",y:"6",width:"52",height:"55",rx:"1"},null),t.createVNode("g",{transform:"translate(15 17)",fill:i(6),"data-allow-mismatch":"attribute"},[t.createVNode("rect",{width:"34",height:"6",rx:"1"},null),t.createVNode("path",{d:"M0 14h34v6H0z"},null),t.createVNode("rect",{y:"28",width:"34",height:"6",rx:"1"},null)])]),t.createVNode("rect",{fill:i(7),y:"61",width:"88",height:"28",rx:"1","data-allow-mismatch":"attribute"},null),t.createVNode("rect",{fill:"#F7F8FA",x:"29",y:"72",width:"30",height:"6",rx:"1"},null)])]),f=()=>t.createVNode("svg",{viewBox:"0 0 160 160"},[t.createVNode("defs",null,[t.createVNode("linearGradient",{x1:"50%",x2:"50%",y2:"100%",id:l(8),"data-allow-mismatch":"attribute"},[c("#EAEDF1","#DCDEE0")])]),u(),p(),d("c"),t.createVNode("path",{d:"m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",fill:i(8),"data-allow-mismatch":"attribute"},null)]),h=()=>t.createVNode("svg",{viewBox:"0 0 160 160"},[t.createVNode("defs",{"data-allow-mismatch":"children"},[t.createVNode("linearGradient",{x1:"50%",y1:"100%",x2:"50%",id:l(9)},[c("#EEE","#D8D8D8")]),t.createVNode("linearGradient",{x1:"100%",y1:"50%",y2:"50%",id:l(10)},[c("#F2F3F5","#DCDEE0")]),t.createVNode("linearGradient",{x1:"50%",x2:"50%",y2:"100%",id:l(11)},[c("#F2F3F5","#DCDEE0")]),t.createVNode("linearGradient",{x1:"50%",x2:"50%",y2:"100%",id:l(12)},[c("#FFF","#F7F8FA")])]),u(),p(),d("d"),t.createVNode("g",{transform:"rotate(-45 113 -4)",fill:"none","data-allow-mismatch":"children"},[t.createVNode("rect",{fill:i(9),x:"24",y:"52.8",width:"5.8",height:"19",rx:"1"},null),t.createVNode("rect",{fill:i(10),x:"22.1",y:"67.3",width:"9.9",height:"28",rx:"1"},null),t.createVNode("circle",{stroke:i(11),"stroke-width":"8",cx:"27",cy:"27",r:"27"},null),t.createVNode("circle",{fill:i(12),cx:"27",cy:"27",r:"16"},null),t.createVNode("path",{d:"M37 7c-8 0-15 5-16 12",stroke:i(11),"stroke-width":"3",opacity:".5","stroke-linecap":"round",transform:"rotate(45 29 13)"},null)])]),g=()=>{var a;if(o.image)return o.image();const n={error:f,search:h,network:v,default:m};return(null==(a=n[e.image])?void 0:a.call(n))||t.createVNode("img",{src:e.image},null)};return()=>t.createVNode("div",{class:zi()},[t.createVNode("div",{class:zi("image"),style:pe(e.imageSize)},[g()]),a(),n()])}})),[Li,Mi,Fi]=Ie("coupon-list"),Ri={code:N(""),coupons:w(),currency:N("¥"),showCount:b,emptyImage:String,enabledTitle:String,disabledTitle:String,disabledCoupons:w(),showExchangeBar:b,showCloseButton:b,closeButtonText:String,inputPlaceholder:String,exchangeMinLength:x(1),exchangeButtonText:String,displayedCouponIndex:x(-1),exchangeButtonLoading:Boolean,exchangeButtonDisabled:Boolean,chosenCoupon:{type:[Number,Array],default:-1}};const Hi=Ye(t.defineComponent({name:Li,props:Ri,emits:["change","exchange","update:code"],setup(e,{emit:o,slots:a}){const[n,r]=Mo(),l=t.ref(),i=t.ref(),s=t.ref(0),c=t.ref(0),d=t.ref(e.code),u=t.computed(()=>!e.exchangeButtonLoading&&(e.exchangeButtonDisabled||!d.value||d.value.length<e.exchangeMinLength)),p=()=>{const e=P(l).height,t=P(i).height+44;c.value=(e>t?e:ce.value)-t},v=()=>{o("exchange",d.value),e.code||(d.value="")},m=e=>{t.nextTick(()=>{var t;return null==(t=n.value[e])?void 0:t.scrollIntoView()})},f=()=>t.createVNode($i,{image:e.emptyImage},{default:()=>[t.createVNode("p",{class:Mi("empty-tip")},[Fi("noCoupon")])]}),h=()=>{if(e.showExchangeBar)return t.createVNode("div",{ref:i,class:Mi("exchange-bar")},[t.createVNode(en,{modelValue:d.value,"onUpdate:modelValue":e=>d.value=e,clearable:!0,border:!1,class:Mi("field"),placeholder:e.inputPlaceholder||Fi("placeholder"),maxlength:"20"},null),t.createVNode(Ot,{plain:!0,type:"primary",class:Mi("exchange"),text:e.exchangeButtonText||Fi("exchange"),loading:e.exchangeButtonLoading,disabled:u.value,onClick:v},null)])},g=()=>{const{coupons:n,chosenCoupon:l}=e,i=e.showCount?` (${n.length})`:"",s=(e.enabledTitle||Fi("enable"))+i;return t.createVNode(fa,{title:s},{default:()=>{var i;return[t.createVNode("div",{class:Mi("list",{"with-bottom":e.showCloseButton}),style:{height:`${c.value}px`}},[n.map((a,n)=>t.createVNode(Si,{key:a.id,ref:r(n),coupon:a,chosen:Array.isArray(l)?l.includes(n):n===l,currency:e.currency,onClick:()=>o("change",Array.isArray(l)?((e=[],t=0)=>e.includes(t)?e.filter(e=>e!==t):[...e,t])(l,n):n)},null)),!n.length&&f(),null==(i=a["list-footer"])?void 0:i.call(a)])]}})},b=()=>{const{disabledCoupons:o}=e,n=e.showCount?` (${o.length})`:"",r=(e.disabledTitle||Fi("disabled"))+n;return t.createVNode(fa,{title:r},{default:()=>{var n;return[t.createVNode("div",{class:Mi("list",{"with-bottom":e.showCloseButton}),style:{height:`${c.value}px`}},[o.map(o=>t.createVNode(Si,{disabled:!0,key:o.id,coupon:o,currency:e.currency},null)),!o.length&&f(),null==(n=a["disabled-list-footer"])?void 0:n.call(a)])]}})};return t.watch(()=>e.code,e=>{d.value=e}),t.watch(ce,p),t.watch(d,e=>o("update:code",e)),t.watch(()=>e.displayedCouponIndex,m),t.onMounted(()=>{p(),m(e.displayedCouponIndex)}),()=>t.createVNode("div",{ref:l,class:Mi()},[h(),t.createVNode(ha,{active:s.value,"onUpdate:active":e=>s.value=e,class:Mi("tab")},{default:()=>[g(),b()]}),t.createVNode("div",{class:Mi("bottom")},[a["list-button"]?a["list-button"]():t.withDirectives(t.createVNode(Ot,{round:!0,block:!0,type:"primary",class:Mi("close"),text:e.closeButtonText||Fi("close"),onClick:()=>o("change",Array.isArray(e.chosenCoupon)?[]:-1)},null),[[t.vShow,e.showCloseButton]])])])}})),ji=(new Date).getFullYear(),[Wi]=Ie("date-picker"),Ui=a({},Jr,{columnsType:{type:Array,default:()=>["year","month","day"]},minDate:{type:Date,default:()=>new Date(ji-10,0,1),validator:c},maxDate:{type:Date,default:()=>new Date(ji+10,11,31),validator:c}});const Yi=Ye(t.defineComponent({name:Wi,props:Ui,emits:["confirm","cancel","change","update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.ref(e.modelValue),r=t.ref(!1),l=t.ref(),i=t.computed(()=>r.value?e.modelValue:n.value),s=t=>t===e.minDate.getFullYear(),c=t=>t===e.maxDate.getFullYear(),d=t=>{const{minDate:o,columnsType:a}=e,n=a.indexOf(t),r=i.value[n];if(r)return+r;switch(t){case"year":return o.getFullYear();case"month":return o.getMonth()+1;case"day":return o.getDate()}},u=()=>{const t=d("year"),o=d("month"),a=s(t)&&(t=>t===e.minDate.getMonth()+1)(o)?e.minDate.getDate():1,n=c(t)&&(t=>t===e.maxDate.getMonth()+1)(o)?e.maxDate.getDate():el(t,o);return tl(a,n,"day",e.formatter,e.filter,i.value)},p=t.computed(()=>e.columnsType.map(t=>{switch(t){case"year":return(()=>{const t=e.minDate.getFullYear(),o=e.maxDate.getFullYear();return tl(t,o,"year",e.formatter,e.filter,i.value)})();case"month":return(()=>{const t=d("year"),o=s(t)?e.minDate.getMonth()+1:1,a=c(t)?e.maxDate.getMonth()+1:12;return tl(o,a,"month",e.formatter,e.filter,i.value)})();case"day":return u();default:return[]}}));t.watch(n,t=>{m(t,e.modelValue)||o("update:modelValue",t)}),t.watch(()=>e.modelValue,(e,t)=>{r.value=m(t,n.value),e=ol(e,p.value),m(e,n.value)||(n.value=e),r.value=!1},{immediate:!0});const f=(...e)=>o("change",...e),h=(...e)=>o("cancel",...e),g=(...e)=>o("confirm",...e);return ot({confirm:()=>{var e;return null==(e=l.value)?void 0:e.confirm()},getSelectedDate:()=>n.value}),()=>t.createVNode(Da,t.mergeProps({ref:l,modelValue:n.value,"onUpdate:modelValue":e=>n.value=e,columns:p.value,onChange:f,onCancel:h,onConfirm:g},v(e,Qr)),a)}})),[Xi,qi,Gi]=Ie("dialog"),Zi=a({},Rt,{title:String,theme:String,width:g,message:[String,Function],callback:Function,allowHtml:Boolean,className:h,transition:N("van-dialog-bounce"),messageAlign:String,closeOnPopstate:b,showCancelButton:Boolean,cancelButtonText:String,cancelButtonColor:String,cancelButtonDisabled:Boolean,confirmButtonText:String,confirmButtonColor:String,confirmButtonDisabled:Boolean,showConfirmButton:b,closeOnClickOverlay:Boolean,keyboardEnabled:b,destroyOnClose:Boolean}),Ki=[...Ht,"transition","closeOnPopstate","destroyOnClose"];var _i=t.defineComponent({name:Xi,props:Zi,emits:["confirm","cancel","keydown","update:show"],setup(e,{emit:a,slots:n}){const r=t.ref(),l=t.reactive({confirm:!1,cancel:!1}),s=e=>a("update:show",e),c=t=>{var o;s(!1),null==(o=e.callback)||o.call(e,t)},d=t=>()=>{e.show&&(a(t),e.beforeClose?(l[t]=!0,Ue(e.beforeClose,{args:[t],done(){c(t),l[t]=!1},canceled(){l[t]=!1}})):c(t))},u=d("cancel"),p=d("confirm"),m=t.withKeys(t=>{var n,l;if(!e.keyboardEnabled)return;if(t.target!==(null==(l=null==(n=r.value)?void 0:n.popupRef)?void 0:l.value))return;({Enter:e.showConfirmButton?p:o,Escape:e.showCancelButton?u:o})[t.key](),a("keydown",t)},["enter","esc"]),f=()=>{const o=n.title?n.title():e.title;if(o)return t.createVNode("div",{class:qi("header",{isolated:!e.message&&!n.default})},[o])},h=o=>{const{message:a,allowHtml:n,messageAlign:r}=e,l=qi("message",{"has-title":o,[r]:r}),s=i(a)?a():a;return n&&"string"==typeof s?t.createVNode("div",{class:l,innerHTML:s},null):t.createVNode("div",{class:l},[s])},g=()=>{if(n.default)return t.createVNode("div",{class:qi("content")},[n.default()]);const{title:o,message:a,allowHtml:r}=e;if(a){const e=!(!o&&!n.title);return t.createVNode("div",{key:r?1:0,class:qi("content",{isolated:!e})},[h(e)])}},b=()=>n.footer?n.footer():"round-button"===e.theme?t.createVNode(tt,{class:qi("footer")},{default:()=>[e.showCancelButton&&t.createVNode(Et,{type:"warning",text:e.cancelButtonText||Gi("cancel"),class:qi("cancel"),color:e.cancelButtonColor,loading:l.cancel,disabled:e.cancelButtonDisabled,onClick:u},null),e.showConfirmButton&&t.createVNode(Et,{type:"danger",text:e.confirmButtonText||Gi("confirm"),class:qi("confirm"),color:e.confirmButtonColor,loading:l.confirm,disabled:e.confirmButtonDisabled,onClick:p},null)]}):t.createVNode("div",{class:[Ee,qi("footer")]},[e.showCancelButton&&t.createVNode(Ot,{size:"large",text:e.cancelButtonText||Gi("cancel"),class:qi("cancel"),style:{color:e.cancelButtonColor},loading:l.cancel,disabled:e.cancelButtonDisabled,onClick:u},null),e.showConfirmButton&&t.createVNode(Ot,{size:"large",text:e.confirmButtonText||Gi("confirm"),class:[qi("confirm"),{[$e]:e.showCancelButton}],style:{color:e.confirmButtonColor},loading:l.confirm,disabled:e.confirmButtonDisabled,onClick:p},null)]);return()=>{const{width:o,title:a,theme:n,message:l,className:i}=e;return t.createVNode(to,t.mergeProps({ref:r,role:"dialog",class:[qi([n]),i],style:{width:ue(o)},tabindex:0,"aria-labelledby":a||l,onKeydown:m,"onUpdate:show":s},v(e,Ki)),{default:()=>[f(),g(),b()]})}}});let Ji;const Qi={title:"",width:"",theme:null,message:"",overlay:!0,callback:null,teleport:"body",className:"",allowHtml:!1,lockScroll:!0,transition:void 0,beforeClose:null,overlayClass:"",overlayStyle:void 0,messageAlign:"",cancelButtonText:"",cancelButtonColor:null,cancelButtonDisabled:!1,confirmButtonText:"",confirmButtonColor:null,confirmButtonDisabled:!1,showConfirmButton:!0,showCancelButton:!1,closeOnPopstate:!0,closeOnClickOverlay:!1,destroyOnClose:!1};let es=a({},Qi);function ts(e){return n?new Promise((o,n)=>{Ji||function(){const e={setup(){const{state:e,toggle:o}=sn();return()=>t.createVNode(_i,t.mergeProps(e,{"onUpdate:show":o}),null)}};({instance:Ji}=cn(e))}(),Ji.open(a({},es,e,{callback:e=>{("confirm"===e?o:n)(e)}}))}):Promise.resolve(void 0)}const os=Ye(_i),[as,ns]=Ie("divider"),rs={dashed:Boolean,hairline:b,vertical:Boolean,contentPosition:N("center")};const ls=Ye(t.defineComponent({name:as,props:rs,setup:(e,{slots:o})=>()=>{var a;return t.createVNode("div",{role:"separator",class:ns({dashed:e.dashed,hairline:e.hairline,vertical:e.vertical,[`content-${e.contentPosition}`]:!!o.default&&!e.vertical})},[!e.vertical&&(null==(a=o.default)?void 0:a.call(o))])}})),[is,ss]=Ie("dropdown-menu"),cs={overlay:b,zIndex:g,duration:V(.2),direction:N("down"),activeColor:String,autoLocate:Boolean,closeOnClickOutside:b,closeOnClickOverlay:b,swipeThreshold:g},ds=Symbol(is);var us=t.defineComponent({name:is,props:cs,setup(e,{slots:o}){const a=Lo(),n=t.ref(),r=t.ref(),i=t.ref(0),{children:s,linkChildren:c}=I(ds),d=G(n),u=t.computed(()=>s.some(e=>e.state.showWrapper)),p=t.computed(()=>e.swipeThreshold&&s.length>+e.swipeThreshold),v=t.computed(()=>{if(u.value&&l(e.zIndex))return{zIndex:+e.zIndex+1}}),m=()=>{s.forEach(e=>{e.toggle(!1)})},f=()=>{if(r.value){const t=P(r);"down"===e.direction?i.value=t.bottom:i.value=ce.value-t.top}},h=(o,n)=>{const{showPopup:r}=o.state,{disabled:l,titleClass:i}=o;return t.createVNode("div",{id:`${a}-${n}`,role:"button",tabindex:l?void 0:0,"data-allow-mismatch":"attribute",class:[ss("item",{disabled:l,grow:p.value}),{[je]:!l}],onClick:()=>{var e;l||(e=n,s.forEach((t,o)=>{o===e?t.toggle():t.state.showPopup&&t.toggle(!1,{immediate:!0})}))}},[t.createVNode("span",{class:[ss("title",{down:r===("down"===e.direction),active:r}),i],style:{color:r?e.activeColor:""}},[t.createVNode("div",{class:"van-ellipsis"},[o.renderTitle()])])])};return ot({close:m,opened:u}),c({id:a,props:e,offset:i,opened:u,updateOffset:f}),H(n,()=>{e.closeOnClickOutside&&m()}),R("scroll",()=>{u.value&&f()},{target:d,passive:!0}),()=>{var e;return t.createVNode("div",{ref:n,class:ss()},[t.createVNode("div",{ref:r,style:v.value,class:ss("bar",{opened:u.value,scrollable:p.value})},[s.map(h)]),null==(e=o.default)?void 0:e.call(o)])}}});const[ps,vs]=Ie("dropdown-item"),ms={title:String,options:w(),disabled:Boolean,teleport:[String,Object],lazyRender:b,modelValue:h,titleClass:h};const fs=Ye(t.defineComponent({name:ps,inheritAttrs:!1,props:ms,emits:["open","opened","close","closed","change","update:modelValue"],setup(e,{emit:o,slots:a,attrs:n}){const r=t.reactive({showPopup:!1,transition:!0,showWrapper:!1}),l=t.ref(),{parent:i,index:s}=D(ds);if(!i)return;const c=e=>()=>o(e),d=c("open"),u=c("close"),p=c("opened"),v=()=>{r.showWrapper=!1,o("closed")},m=t=>{e.teleport&&t.stopPropagation()},f=a=>{const{activeColor:n}=i.props,{disabled:l}=a,s=a.value===e.modelValue;return t.createVNode(Fa,{role:"menuitem",key:String(a.value),icon:a.icon,title:a.text,class:vs("option",{active:s,disabled:l}),style:{color:s?n:""},tabindex:s?0:-1,clickable:!l,onClick:()=>{l||(r.showPopup=!1,a.value!==e.modelValue&&(o("update:modelValue",a.value),o("change",a.value)))}},{value:()=>{if(s)return t.createVNode(wt,{class:vs("icon"),color:l?void 0:n,name:"success"},null)}})},h=()=>{const{offset:o}=i,{autoLocate:c,zIndex:h,overlay:g,duration:b,direction:y,closeOnClickOverlay:w}=i.props,x=ve(h);let V=o.value;if(c&&l.value){const e=function(e){let t=e.parentElement;for(;t;){if(t&&"HTML"!==t.tagName&&"BODY"!==t.tagName&&de(t))return t;t=t.parentElement}return null}(l.value);e&&(V-=P(e).top)}return"down"===y?x.top=`${V}px`:x.bottom=`${V}px`,t.withDirectives(t.createVNode("div",t.mergeProps({ref:l,style:x,class:vs([y]),onClick:m},n),[t.createVNode(to,{show:r.showPopup,"onUpdate:show":e=>r.showPopup=e,role:"menu",class:vs("content"),overlay:g,overlayProps:{duration:r.transition&&!i.opened.value?b:0},position:"down"===y?"top":"bottom",duration:r.transition?b:0,lazyRender:e.lazyRender,overlayStyle:{position:"absolute"},"aria-labelledby":`${i.id}-${s.value}`,"data-allow-mismatch":"attribute",closeOnClickOverlay:w,onOpen:d,onClose:u,onOpened:p,onClosed:v},{default:()=>{var t;return[e.options.map(f),null==(t=a.default)?void 0:t.call(a)]}})]),[[t.vShow,r.showWrapper]])};return ot({state:r,toggle:(e=!r.showPopup,t={})=>{e!==r.showPopup&&(r.showPopup=e,r.transition=!t.immediate,e&&(i.updateOffset(),r.showWrapper=!0))},renderTitle:()=>{if(a.title)return a.title();if(e.title)return e.title;const t=e.options.find(t=>t.value===e.modelValue);return t?t.text:""}}),()=>e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[h()]}):h()}})),hs=Ye(us),gs={gap:{type:[Number,Object],default:24},icon:String,axis:N("y"),magnetic:String,offset:Object,teleport:{type:[String,Object],default:"body"}},[bs,ys]=Ie("floating-bubble");const ws=Ye(t.defineComponent({name:bs,inheritAttrs:!1,props:gs,emits:["click","update:offset","offsetChange"],setup(e,{slots:o,emit:a,attrs:n}){const l=t.ref(),i=t.ref({x:0,y:0,width:0,height:0}),s=t.computed(()=>r(e.gap)?e.gap.x:e.gap),c=t.computed(()=>r(e.gap)?e.gap.y:e.gap),d=t.computed(()=>({top:c.value,right:se.value-i.value.width-s.value,bottom:ce.value-i.value.height-c.value,left:s.value})),u=t.ref(!1);let p=!1;const m=t.computed(()=>{const e={},t=ue(i.value.x),o=ue(i.value.y);return e.transform=`translate3d(${t}, ${o}, 0)`,!u.value&&p||(e.transition="none"),e}),f=()=>{if(!V.value)return;const{width:t,height:o}=P(l.value),{offset:a}=e;i.value={x:a?a.x:se.value-t-s.value,y:a?a.y:ce.value-o-c.value,width:t,height:o}},h=jt();let g=0,b=0;const y=e=>{h.start(e),u.value=!0,g=i.value.x,b=i.value.y};R("touchmove",t=>{if(t.preventDefault(),h.move(t),"lock"!==e.axis&&!h.isTap.value){if("x"===e.axis||"xy"===e.axis){let e=g+h.deltaX.value;e<d.value.left&&(e=d.value.left),e>d.value.right&&(e=d.value.right),i.value.x=e}if("y"===e.axis||"xy"===e.axis){let e=b+h.deltaY.value;e<d.value.top&&(e=d.value.top),e>d.value.bottom&&(e=d.value.bottom),i.value.y=e}const t=v(i.value,["x","y"]);a("update:offset",t)}},{target:l});const w=()=>{u.value=!1,t.nextTick(()=>{if("x"===e.magnetic){const e=Xe([d.value.left,d.value.right],i.value.x);i.value.x=e}if("y"===e.magnetic){const e=Xe([d.value.top,d.value.bottom],i.value.y);i.value.y=e}if(!h.isTap.value){const e=v(i.value,["x","y"]);a("update:offset",e),g===e.x&&b===e.y||a("offsetChange",e)}})},x=e=>{h.isTap.value?a("click",e):e.stopPropagation()};t.onMounted(()=>{f(),t.nextTick(()=>{p=!0})}),t.watch([se,ce,s,c,()=>e.offset],f,{deep:!0});const V=t.ref(!0);return t.onActivated(()=>{V.value=!0}),t.onDeactivated(()=>{e.teleport&&(V.value=!1)}),()=>{const a=t.withDirectives(t.createVNode("div",t.mergeProps({class:ys(),ref:l,onTouchstartPassive:y,onTouchend:w,onTouchcancel:w,onClickCapture:x,style:m.value},n),[o.default?o.default():t.createVNode(xt,{name:e.icon,class:ys("icon")},null)]),[[t.vShow,V.value]]);return e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[a]}):a}}})),xs={height:V(0),anchors:w(),duration:V(.3),contentDraggable:b,lockScroll:Boolean,safeAreaInsetBottom:b},[Vs,Ns]=Ie("floating-panel");const Cs=Ye(t.defineComponent({name:Vs,props:xs,emits:["heightChange","update:height"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=t.ref(),l=Co(()=>+e.height,e=>o("update:height",e)),i=t.computed(()=>{var t,o;return{min:null!=(t=e.anchors[0])?t:100,max:null!=(o=e.anchors[e.anchors.length-1])?o:Math.round(.6*ce.value)}}),s=t.computed(()=>e.anchors.length>=2?e.anchors:[i.value.min,i.value.max]),c=t.ref(!1),d=t.computed(()=>({height:ue(i.value.max),transform:`translateY(calc(100% + ${ue(-l.value)}))`,transition:c.value?"none":`transform ${e.duration}s cubic-bezier(0.18, 0.89, 0.32, 1.28)`}));let u,p=-1;const v=jt(),m=e=>{v.start(e),c.value=!0,u=-l.value,p=-1},f=()=>{p=-1,c.value=!1,l.value=Xe(s.value,l.value),l.value!==-u&&o("heightChange",{height:l.value})};t.watch(i,()=>{l.value=Xe(s.value,l.value)},{immediate:!0}),Yt(n,()=>e.lockScroll||c.value),R("touchmove",t=>{var o;v.move(t);const a=t.target;if(r.value===a||(null==(o=r.value)?void 0:o.contains(a))){const{scrollTop:o}=r.value;if(p=Math.max(p,o),!e.contentDraggable)return;if(-u<i.value.max)le(t,!0);else if(!(o<=0&&v.deltaY.value>0)||p>0)return}const n=v.deltaY.value+u;l.value=-(e=>{const t=Math.abs(e),{min:o,max:a}=i.value;return t>a?-(a+.2*(t-a)):t<o?-(o-.2*(o-t)):e})(n)},{target:n});return()=>{var o;return t.createVNode("div",{class:[Ns(),{"van-safe-area-bottom":e.safeAreaInsetBottom}],ref:n,style:d.value,onTouchstartPassive:m,onTouchend:f,onTouchcancel:f},[a.header?a.header():t.createVNode("div",{class:Ns("header")},[t.createVNode("div",{class:Ns("header-bar")},null)]),t.createVNode("div",{class:Ns("content"),ref:r},[null==(o=a.default)?void 0:o.call(a)])])}}})),[ks,Ss]=Ie("grid"),Ts={square:Boolean,center:b,border:b,gutter:g,reverse:Boolean,iconSize:g,direction:String,clickable:Boolean,columnNum:V(4)},Bs=Symbol(ks);const Ps=Ye(t.defineComponent({name:ks,props:Ts,setup(e,{slots:o}){const{linkChildren:a}=I(Bs);return a({props:e}),()=>{var a;return t.createVNode("div",{style:{paddingLeft:ue(e.gutter)},class:[Ss(),{[Ee]:e.border&&!e.gutter}]},[null==(a=o.default)?void 0:a.call(o)])}}})),[Ds,Os]=Ie("grid-item"),As=a({},at,{dot:Boolean,text:String,icon:String,badge:g,iconColor:String,iconPrefix:String,badgeProps:Object});const Is=Ye(t.defineComponent({name:Ds,props:As,setup(e,{slots:o}){const{parent:a,index:n}=D(Bs),r=rt();if(!a)return;const l=t.computed(()=>{const{square:e,gutter:t,columnNum:o}=a.props,r=100/+o+"%",l={flexBasis:r};if(e)l.paddingTop=r;else if(t){const e=ue(t);l.paddingRight=e,n.value>=+o&&(l.marginTop=e)}return l}),i=t.computed(()=>{const{square:e,gutter:t}=a.props;if(e&&t){const e=ue(t);return{right:e,bottom:e,height:"auto"}}});return()=>{const{center:n,border:s,square:c,gutter:d,reverse:u,direction:p,clickable:v}=a.props,m=[Os("content",[p,{center:n,square:c,reverse:u,clickable:v,surround:s&&d}]),{[ze]:s}];return t.createVNode("div",{class:[Os({square:c})],style:l.value},[t.createVNode("div",{role:v?"button":void 0,class:m,style:i.value,tabindex:v?0:void 0,onClick:r},[o.default?o.default():[o.icon?t.createVNode(ct,t.mergeProps({dot:e.dot,content:e.badge},e.badgeProps),{default:o.icon}):e.icon?t.createVNode(wt,{dot:e.dot,name:e.icon,size:a.props.iconSize,badge:e.badge,class:Os("icon"),color:e.iconColor,badgeProps:e.badgeProps,classPrefix:e.iconPrefix},null):void 0,o.text?o.text():e.text?t.createVNode("span",{class:Os("text")},[e.text]):void 0]])])}}})),[zs,Es]=Ie("highlight"),$s={autoEscape:b,caseSensitive:Boolean,highlightClass:String,highlightTag:N("span"),keywords:y([String,Array]),sourceString:N(""),tag:N("div"),unhighlightClass:String,unhighlightTag:N("span")};const Ls=Ye(t.defineComponent({name:zs,props:$s,setup(e){const o=t.computed(()=>{const{autoEscape:t,caseSensitive:o,keywords:a,sourceString:n}=e,r=o?"g":"gi";let l=(Array.isArray(a)?a:[a]).filter(e=>e).reduce((e,o)=>{t&&(o=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));const a=new RegExp(o,r);let l;for(;l=a.exec(n);){const t=l.index,o=a.lastIndex;t>=o?a.lastIndex++:e.push({start:t,end:o,highlight:!0})}return e},[]);l=l.sort((e,t)=>e.start-t.start).reduce((e,t)=>{const o=e[e.length-1];if(!o||t.start>o.end){const a=o?o.end:0,n=t.start;a!==n&&e.push({start:a,end:n,highlight:!1}),e.push(t)}else o.end=Math.max(o.end,t.end);return e},[]);const i=l[l.length-1];return i||l.push({start:0,end:n.length,highlight:!1}),i&&i.end<n.length&&l.push({start:i.end,end:n.length,highlight:!1}),l}),a=()=>{const{sourceString:a,highlightClass:n,unhighlightClass:r,highlightTag:l,unhighlightTag:i}=e;return o.value.map(e=>{const{start:o,end:s,highlight:c}=e,d=a.slice(o,s);return c?t.createVNode(l,{class:[Es("tag"),n]},{default:()=>[d]}):t.createVNode(i,{class:r},{default:()=>[d]})})};return()=>{const{tag:o}=e;return t.createVNode(o,{class:Es()},{default:()=>[a()]})}}})),Ms=e=>Math.sqrt((e[0].clientX-e[1].clientX)**2+(e[0].clientY-e[1].clientY)**2),Fs=Ie("image-preview")[1],Rs={src:String,show:Boolean,active:Number,minZoom:y(g),maxZoom:y(g),rootWidth:y(Number),rootHeight:y(Number),disableZoom:Boolean,doubleScale:Boolean,closeOnClickImage:Boolean,closeOnClickOverlay:Boolean,vertical:Boolean};var Hs=t.defineComponent({props:Rs,emits:["scale","close","longPress"],setup(e,{emit:o,slots:a}){const n=t.reactive({scale:1,moveX:0,moveY:0,moving:!1,zooming:!1,initializing:!1,imageRatio:0}),r=jt(),l=t.ref(),i=t.ref(),s=t.ref(!1),c=t.ref(!1);let d=0;const u=t.computed(()=>{const{scale:e,moveX:t,moveY:o,moving:a,zooming:r,initializing:l}=n,i={transitionDuration:r||a||l?"0s":".3s"};return(1!==e||c.value)&&(i.transform=`matrix(${e}, 0, 0, ${e}, ${t}, ${o})`),i}),p=t.computed(()=>{if(n.imageRatio){const{rootWidth:t,rootHeight:o}=e,a=s.value?o/n.imageRatio:t;return Math.max(0,(n.scale*a-t)/2)}return 0}),v=t.computed(()=>{if(n.imageRatio){const{rootWidth:t,rootHeight:o}=e,a=s.value?o:t*n.imageRatio;return Math.max(0,(n.scale*a-o)/2)}return 0}),m=(t,a)=>{var r;if((t=we(t,+e.minZoom,+e.maxZoom+1))!==n.scale){const i=t/n.scale;if(n.scale=t,a){const e=P(null==(r=l.value)?void 0:r.$el),t={x:.5*e.width,y:.5*e.height},o=n.moveX-(a.x-e.left-t.x)*(i-1),s=n.moveY-(a.y-e.top-t.y)*(i-1);n.moveX=we(o,-p.value,p.value),n.moveY=we(s,-v.value,v.value)}else n.moveX=0,n.moveY=c.value?d:0;o("scale",{scale:t,index:e.active})}},f=()=>{m(1)};let h,g,b,y,w,x,V,N,C=!1;const S=t=>{const{touches:o}=t;if(h=o.length,2===h&&e.disableZoom)return;const{offsetX:a}=r;r.start(t),g=n.moveX,b=n.moveY,N=Date.now(),C=!1,n.moving=1===h&&(1!==n.scale||c.value),n.zooming=2===h&&!a.value,n.zooming&&(y=n.scale,w=Ms(o))},T=t=>{var a;const n=null==(a=i.value)?void 0:a.$el;if(!n)return;const r=n.firstElementChild,l=t.target===n,s=null==r?void 0:r.contains(t.target);!e.closeOnClickImage&&s||!e.closeOnClickOverlay&&l||o("close")},B=t=>{if(h>1)return;const a=Date.now()-N;r.isTap.value&&(a<250?e.doubleScale?V?(clearTimeout(V),V=null,(()=>{const e=n.scale>1?1:2;m(e,2===e||c.value?{x:r.startX.value,y:r.startY.value}:void 0)})()):V=setTimeout(()=>{T(t),V=null},250):T(t):a>500&&o("longPress"))},D=t=>{let o=!1;if((n.moving||n.zooming)&&(o=!0,n.moving&&g===n.moveX&&b===n.moveY&&(o=!1),!t.touches.length)){n.zooming&&(n.moveX=we(n.moveX,-p.value,p.value),n.moveY=we(n.moveY,-v.value,v.value),n.zooming=!1),n.moving=!1,g=0,b=0,y=1,n.scale<1&&f();const t=+e.maxZoom;n.scale>t&&m(t,x)}le(t,o),B(t),r.reset()},O=()=>{const{rootWidth:t,rootHeight:o}=e,a=o/t,{imageRatio:r}=n;s.value=n.imageRatio>a&&r<2.6,c.value=n.imageRatio>a&&r>=2.6,c.value&&(d=(r*t-o)/2,n.moveY=d,n.initializing=!0,k(()=>{n.initializing=!1})),f()},A=e=>{const{naturalWidth:t,naturalHeight:o}=e.target;n.imageRatio=o/t,O()};return t.watch(()=>e.active,f),t.watch(()=>e.show,e=>{e||f()}),t.watch(()=>[e.rootWidth,e.rootHeight],O),R("touchmove",t=>{const{touches:o}=t;if(r.move(t),n.moving){const{deltaX:o,deltaY:a}=r,l=o.value+g,i=a.value+b;if((e.vertical?r.isVertical()&&Math.abs(i)>v.value:r.isHorizontal()&&Math.abs(l)>p.value)&&!C)return void(n.moving=!1);C=!0,le(t,!0),n.moveX=we(l,-p.value,p.value),n.moveY=we(i,-v.value,v.value)}if(n.zooming&&(le(t,!0),2===o.length)){const e=Ms(o),t=y*e/w;x=(e=>({x:(e[0].clientX+e[1].clientX)/2,y:(e[0].clientY+e[1].clientY)/2}))(o),m(t,x)}},{target:t.computed(()=>{var e;return null==(e=i.value)?void 0:e.$el})}),ot({resetScale:f}),()=>{const o={loading:()=>t.createVNode(Tt,{type:"spinner"},null)};return t.createVNode(ua,{ref:i,class:Fs("swipe-item"),onTouchstartPassive:S,onTouchend:D,onTouchcancel:D},{default:()=>[a.image?t.createVNode("div",{class:Fs("image-wrap")},[a.image({src:e.src,onLoad:A,style:u.value})]):t.createVNode(fl,{ref:l,src:e.src,fit:"contain",class:Fs("image",{vertical:s.value}),style:u.value,onLoad:A},o)]})}}});const[js,Ws]=Ie("image-preview"),Us=["show","teleport","transition","overlayStyle","closeOnPopstate"],Ys={show:Boolean,loop:b,images:w(),minZoom:V(1/3),maxZoom:V(3),overlay:b,vertical:Boolean,closeable:Boolean,showIndex:b,className:h,closeIcon:N("clear"),transition:String,beforeClose:Function,doubleScale:b,overlayClass:h,overlayStyle:Object,swipeDuration:V(300),startPosition:V(0),showIndicators:Boolean,closeOnPopstate:b,closeOnClickImage:b,closeOnClickOverlay:b,closeIconPosition:N("top-right"),teleport:[String,Object]};var Xs=t.defineComponent({name:js,props:Ys,emits:["scale","close","closed","change","longPress","update:show"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=t.ref(),l=t.reactive({active:0,rootWidth:0,rootHeight:0,disableZoom:!1}),i=()=>{if(n.value){const e=P(n.value.$el);l.rootWidth=e.width,l.rootHeight=e.height,n.value.resize()}},s=e=>o("scale",e),c=e=>o("update:show",e),d=()=>{Ue(e.beforeClose,{args:[l.active],done:()=>c(!1)})},u=e=>{e!==l.active&&(l.active=e,o("change",e))},p=()=>{if(e.showIndex)return t.createVNode("div",{class:Ws("index")},[a.index?a.index({index:l.active}):`${l.active+1} / ${e.images.length}`])},m=()=>{if(a.cover)return t.createVNode("div",{class:Ws("cover")},[a.cover()])},f=()=>{l.disableZoom=!0},h=()=>{l.disableZoom=!1},g=()=>{if(e.closeable)return t.createVNode(wt,{role:"button",name:e.closeIcon,class:[Ws("close-icon",e.closeIconPosition),je],onClick:d},null)},b=()=>o("closed"),y=(e,t)=>{var o;return null==(o=n.value)?void 0:o.swipeTo(e,t)};return ot({resetScale:()=>{var e;null==(e=r.value)||e.resetScale()},swipeTo:y}),t.onMounted(i),t.watch([se,ce],i),t.watch(()=>e.startPosition,e=>u(+e)),t.watch(()=>e.show,a=>{const{images:n,startPosition:r}=e;a?(u(+r),t.nextTick(()=>{i(),y(+r,{immediate:!0})})):o("close",{index:l.active,url:n[l.active]})}),()=>t.createVNode(to,t.mergeProps({class:[Ws(),e.className],overlayClass:[Ws("overlay"),e.overlayClass],onClosed:b,"onUpdate:show":c},v(e,Us)),{default:()=>[g(),t.createVNode(Go,{ref:n,lazyRender:!0,loop:e.loop,class:Ws("swipe"),vertical:e.vertical,duration:e.swipeDuration,initialSwipe:e.startPosition,showIndicators:e.showIndicators,indicatorColor:"white",onChange:u,onDragEnd:h,onDragStart:f},{default:()=>[e.images.map((n,i)=>t.createVNode(Hs,{ref:e=>{i===l.active&&(r.value=e)},src:n,show:e.show,active:l.active,maxZoom:e.maxZoom,minZoom:e.minZoom,rootWidth:l.rootWidth,rootHeight:l.rootHeight,disableZoom:l.disableZoom,doubleScale:e.doubleScale,closeOnClickImage:e.closeOnClickImage,closeOnClickOverlay:e.closeOnClickOverlay,vertical:e.vertical,onScale:s,onClose:d,onLongPress:()=>o("longPress",{index:i})},{image:a.image}))]}),p(),m()]})}});let qs;const Gs={loop:!0,images:[],maxZoom:3,minZoom:1/3,onScale:void 0,onClose:void 0,onChange:void 0,vertical:!1,teleport:"body",className:"",showIndex:!0,closeable:!1,closeIcon:"clear",transition:void 0,beforeClose:void 0,doubleScale:!0,overlayStyle:void 0,overlayClass:void 0,startPosition:0,swipeDuration:300,showIndicators:!1,closeOnPopstate:!0,closeOnClickOverlay:!0,closeIconPosition:"top-right"};const Zs=(e,o=0)=>{if(n)return qs||({instance:qs}=cn({setup(){const{state:e,toggle:o}=sn(),a=()=>{e.images=[]};return()=>t.createVNode(Xs,t.mergeProps(e,{onClosed:a,"onUpdate:show":o}),null)}})),e=Array.isArray(e)?{images:e,startPosition:o}:e,qs.open(a({},Gs,e)),qs},Ks=Ye(Xs);const[_s,Js]=Ie("index-bar"),Qs={sticky:b,zIndex:g,teleport:[String,Object],highlightColor:String,stickyOffsetTop:x(0),indexList:{type:Array,default:function(){const e="A".charCodeAt(0);return Array(26).fill("").map((t,o)=>String.fromCharCode(e+o))}}},ec=Symbol(_s);var tc=t.defineComponent({name:_s,props:Qs,emits:["select","change"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=t.ref(),i=t.ref(""),s=jt(),c=G(n),{children:d,linkChildren:u}=I(ec);let p;u({props:e});const v=t.computed(()=>{if(l(e.zIndex))return{zIndex:+e.zIndex+1}}),m=t.computed(()=>{if(e.highlightColor)return{color:e.highlightColor}}),f=(t,o)=>{for(let a=d.length-1;a>=0;a--){const n=a>0?o[a-1].height:0;if(t+(e.sticky?n+e.stickyOffsetTop:0)>=o[a].top)return a}return-1},h=e=>d.find(t=>String(t.index)===e),g=()=>{if(ie(n))return;const{sticky:t,indexList:o}=e,a=J(c.value),r=P(c),l=d.map(e=>e.getRect(c.value,r));let s=-1;if(p){const t=h(p);if(t){const o=t.getRect(c.value,r);s=e.sticky&&e.stickyOffsetTop?f(o.top-e.stickyOffsetTop,l):f(o.top,l)}}else s=f(a,l);i.value=o[s],t&&d.forEach((t,o)=>{const{state:n,$el:i}=t;if(o===s||o===s-1){const e=i.getBoundingClientRect();n.left=e.left,n.width=e.width}else n.left=null,n.width=null;if(o===s)n.active=!0,n.top=Math.max(e.stickyOffsetTop,l[o].top-a)+r.top;else if(o===s-1&&""===p){const e=l[s].top-a;n.active=e>0,n.top=e+r.top-l[o].height}else n.active=!1}),p=""},b=()=>{t.nextTick(g)};R("scroll",g,{target:c,passive:!0}),t.onMounted(b),t.watch(()=>e.indexList,b),t.watch(i,e=>{e&&o("change",e)});const y=t=>{p=String(t);const a=h(p);if(a){const t=J(c.value),n=P(c),{offsetHeight:r}=document.documentElement;if(a.$el.scrollIntoView(),t===r-n.height)return void g();e.sticky&&e.stickyOffsetTop&&(ee()===r-n.height?te(ee()):te(ee()-e.stickyOffsetTop)),o("select",a.index)}},w=e=>{const{index:t}=e.dataset;t&&y(t)},x=e=>{w(e.target)};let V;const N=()=>t.createVNode("div",{ref:r,class:Js("sidebar"),style:v.value,onClick:x,onTouchstartPassive:s.start},[e.indexList.map(e=>{const o=e===i.value;return t.createVNode("span",{class:Js("index",{active:o}),style:o?m.value:void 0,"data-index":e},[e])})]);return ot({scrollTo:y}),R("touchmove",e=>{if(s.move(e),s.isVertical()){le(e);const{clientX:t,clientY:o}=e.touches[0],a=document.elementFromPoint(t,o);if(a){const{index:e}=a.dataset;e&&V!==e&&(V=e,w(a))}}},{target:r}),()=>{var o;return t.createVNode("div",{ref:n,class:Js()},[e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[N()]}):N(),null==(o=a.default)?void 0:o.call(a)])}}});const[oc,ac]=Ie("index-anchor"),nc={index:g};const rc=Ye(t.defineComponent({name:oc,props:nc,setup(e,{slots:o}){const n=t.reactive({top:0,left:null,rect:{top:0,height:0},width:null,active:!1}),r=t.ref(),{parent:l}=D(ec);if(!l)return;const i=()=>n.active&&l.props.sticky,s=t.computed(()=>{const{zIndex:e,highlightColor:t}=l.props;if(i())return a(ve(e),{left:n.left?`${n.left}px`:void 0,width:n.width?`${n.width}px`:void 0,transform:n.top?`translate3d(0, ${n.top}px, 0)`:void 0,color:t})});return ot({state:n,getRect:(e,t)=>{const o=P(r);return n.rect.height=o.height,e===window||e===document.body?n.rect.top=o.top+ee():n.rect.top=o.top+J(e)-t.top,n.rect}}),()=>{const a=i();return t.createVNode("div",{ref:r,style:{height:a?`${n.rect.height}px`:void 0}},[t.createVNode("div",{style:s.value,class:[ac({sticky:a}),{[Me]:a}]},[o.default?o.default():e.index])])}}})),lc=Ye(tc),[ic,sc,cc]=Ie("list"),dc={error:Boolean,offset:V(300),loading:Boolean,disabled:Boolean,finished:Boolean,scroller:Object,errorText:String,direction:N("down"),loadingText:String,finishedText:String,immediateCheck:b};const uc=Ye(t.defineComponent({name:ic,props:dc,emits:["load","update:error","update:loading"],setup(e,{emit:o,slots:a}){const n=t.ref(e.loading),r=t.ref(),l=t.ref(),i=ra(),s=G(r),c=t.computed(()=>e.scroller||s.value),d=()=>{t.nextTick(()=>{if(n.value||e.finished||e.disabled||e.error||!1===(null==i?void 0:i.value))return;const{direction:t}=e,a=+e.offset,s=P(c);if(!s.height||ie(r))return;let d=!1;const u=P(l);d="up"===t?s.top-u.top<=a:u.bottom-s.bottom<=a,d&&(n.value=!0,o("update:loading",!0),o("load"))})},u=()=>{if(e.finished){const o=a.finished?a.finished():e.finishedText;if(o)return t.createVNode("div",{class:sc("finished-text")},[o])}},p=()=>{o("update:error",!1),d()},v=()=>{if(e.error){const o=a.error?a.error():e.errorText;if(o)return t.createVNode("div",{role:"button",class:sc("error-text"),tabindex:0,onClick:p},[o])}},m=()=>{if(n.value&&!e.finished&&!e.disabled)return t.createVNode("div",{class:sc("loading")},[a.loading?a.loading():t.createVNode(Tt,{class:sc("loading-icon")},{default:()=>[e.loadingText||cc("loading")]})])};return t.watch(()=>[e.loading,e.finished,e.error],d),i&&t.watch(i,e=>{e&&d()}),t.onUpdated(()=>{n.value=e.loading}),t.onMounted(()=>{e.immediateCheck&&d()}),ot({check:d}),R("scroll",d,{target:c,passive:!0}),()=>{var o;const i=null==(o=a.default)?void 0:o.call(a),s=t.createVNode("div",{ref:l,class:sc("placeholder")},null);return t.createVNode("div",{ref:r,role:"feed",class:sc(),"aria-busy":n.value},["down"===e.direction?i:s,m(),u(),v(),"up"===e.direction?i:s])}}})),[pc,vc]=Ie("nav-bar"),mc={title:String,fixed:Boolean,zIndex:g,border:b,leftText:String,rightText:String,leftDisabled:Boolean,rightDisabled:Boolean,leftArrow:Boolean,placeholder:Boolean,safeAreaInsetTop:Boolean,clickable:b};const fc=Ye(t.defineComponent({name:pc,props:mc,emits:["clickLeft","clickRight"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=Ke(n,vc),l=t=>{e.leftDisabled||o("clickLeft",t)},i=t=>{e.rightDisabled||o("clickRight",t)},s=()=>{const{title:o,fixed:r,border:s,zIndex:c}=e,d=ve(c),u=e.leftArrow||e.leftText||a.left,p=e.rightText||a.right;return t.createVNode("div",{ref:n,style:d,class:[vc({fixed:r}),{[Me]:s,"van-safe-area-top":e.safeAreaInsetTop}]},[t.createVNode("div",{class:vc("content")},[u&&t.createVNode("div",{class:[vc("left",{disabled:e.leftDisabled}),e.clickable&&!e.leftDisabled?je:""],onClick:l},[a.left?a.left():[e.leftArrow&&t.createVNode(wt,{class:vc("arrow"),name:"arrow-left"},null),e.leftText&&t.createVNode("span",{class:vc("text")},[e.leftText])]]),t.createVNode("div",{class:[vc("title"),"van-ellipsis"]},[a.title?a.title():o]),p&&t.createVNode("div",{class:[vc("right",{disabled:e.rightDisabled}),e.clickable&&!e.rightDisabled?je:""],onClick:i},[a.right?a.right():t.createVNode("span",{class:vc("text")},[e.rightText])])])])};return()=>e.fixed&&e.placeholder?r(s):s()}})),[hc,gc]=Ie("notice-bar"),bc={text:String,mode:String,color:String,delay:V(1),speed:V(60),leftIcon:String,wrapable:Boolean,background:String,scrollable:{type:Boolean,default:null}};const yc=Ye(t.defineComponent({name:hc,props:bc,emits:["close","replay"],setup(e,{emit:o,slots:a}){let n,r=0,i=0;const s=t.ref(),c=t.ref(),d=t.reactive({show:!0,offset:0,duration:0}),u=t=>{"closeable"===e.mode&&(d.show=!1,o("close",t))},p=()=>{if(a["right-icon"])return a["right-icon"]();const o="closeable"===e.mode?"cross":"link"===e.mode?"arrow":void 0;return o?t.createVNode(wt,{name:o,class:gc("right-icon"),onClick:u},null):void 0},v=()=>{d.offset=r,d.duration=0,k(()=>{T(()=>{d.offset=-i,d.duration=(i+r)/+e.speed,o("replay")})})},m=()=>{const o=!1===e.scrollable&&!e.wrapable,n={transform:d.offset?`translateX(${d.offset}px)`:"",transitionDuration:`${d.duration}s`};return t.createVNode("div",{ref:s,role:"marquee",class:gc("wrap")},[t.createVNode("div",{ref:c,style:n,class:[gc("content"),{"van-ellipsis":o}],onTransitionend:v},[a.default?a.default():e.text])])},f=()=>{const{delay:t,speed:o,scrollable:a}=e,u=l(t)?1e3*+t:0;r=0,i=0,d.offset=0,d.duration=0,clearTimeout(n),n=setTimeout(()=>{if(!s.value||!c.value||!1===a)return;const e=P(s).width,t=P(c).width;(a||t>e)&&T(()=>{r=e,i=t,d.offset=-i,d.duration=i/+o})},u)};return Ge(f),F(f),R("pageshow",f),ot({reset:f}),t.watch(()=>[e.text,e.scrollable],f),()=>{const{color:o,wrapable:n,background:r}=e;return t.withDirectives(t.createVNode("div",{role:"alert",class:gc({wrapable:n}),style:{color:o,background:r}},[a["left-icon"]?a["left-icon"]():e.leftIcon?t.createVNode(wt,{class:gc("left-icon"),name:e.leftIcon},null):void 0,m(),p()]),[[t.vShow,d.show]])}}})),[wc,xc]=Ie("notify"),Vc=["lockScroll","position","show","teleport","zIndex"],Nc=a({},Rt,{type:N("danger"),color:String,message:g,position:N("top"),className:h,background:String,lockScroll:Boolean});var Cc=t.defineComponent({name:wc,props:Nc,emits:["update:show"],setup(e,{emit:o,slots:a}){const n=e=>o("update:show",e);return()=>t.createVNode(to,t.mergeProps({class:[xc([e.type]),e.className],style:{color:e.color,background:e.background},overlay:!1,duration:.2,"onUpdate:show":n},v(e,Vc)),{default:()=>[a.default?a.default():e.message]})}});let kc,Sc;let Tc={type:"danger",color:void 0,message:"",onClose:void 0,onClick:void 0,onOpened:void 0,duration:3e3,position:void 0,className:"",lockScroll:!1,background:void 0};const Bc=()=>{Sc&&Sc.toggle(!1)};const Pc=Ye(Cc),[Dc,Oc]=Ie("key"),Ac=t.createVNode("svg",{class:Oc("collapse-icon"),viewBox:"0 0 30 24"},[t.createVNode("path",{d:"M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z",fill:"currentColor"},null)]),Ic=t.createVNode("svg",{class:Oc("delete-icon"),viewBox:"0 0 32 22"},[t.createVNode("path",{d:"M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z",fill:"currentColor"},null)]);var zc=t.defineComponent({name:Dc,props:{type:String,text:g,color:String,wider:Boolean,large:Boolean,loading:Boolean},emits:["press"],setup(e,{emit:o,slots:a}){const n=t.ref(!1),r=jt(),l=e=>{r.start(e),n.value=!0},i=e=>{r.move(e),r.direction.value&&(n.value=!1)},s=t=>{n.value&&(a.default||le(t),n.value=!1,o("press",e.text,e.type))},c=()=>{if(e.loading)return t.createVNode(Tt,{class:Oc("loading-icon")},null);const o=a.default?a.default():e.text;switch(e.type){case"delete":return o||Ic;case"extra":return o||Ac;default:return o}};return()=>t.createVNode("div",{class:Oc("wrapper",{wider:e.wider}),onTouchstartPassive:l,onTouchmovePassive:i,onTouchend:s,onTouchcancel:s},[t.createVNode("div",{role:"button",tabindex:0,class:Oc([e.color,{large:e.large,active:n.value,delete:"delete"===e.type}])},[c()])])}});const[Ec,$c]=Ie("number-keyboard"),Lc={show:Boolean,title:String,theme:N("default"),zIndex:g,teleport:[String,Object],maxlength:V(1/0),modelValue:N(""),transition:b,blurOnClose:b,showDeleteKey:b,randomKeyOrder:Boolean,closeButtonText:String,deleteButtonText:String,closeButtonLoading:Boolean,hideOnClickOutside:b,safeAreaInsetBottom:b,extraKey:{type:[String,Array],default:""}};const Mc=Ye(t.defineComponent({name:Ec,inheritAttrs:!1,props:Lc,emits:["show","hide","blur","input","close","delete","update:modelValue"],setup(e,{emit:o,slots:a,attrs:n}){const r=t.ref(),l=()=>{const t=Array(9).fill("").map((e,t)=>({text:t+1}));return e.randomKeyOrder&&function(e){for(let t=e.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1)),a=e[t];e[t]=e[o],e[o]=a}}(t),t},i=t.computed(()=>"custom"===e.theme?(()=>{const t=l(),{extraKey:o}=e,a=Array.isArray(o)?o:[o];return 0===a.length?t.push({text:0,wider:!0}):1===a.length?t.push({text:0,wider:!0},{text:a[0],type:"extra"}):2===a.length&&t.push({text:a[0],type:"extra"},{text:0},{text:a[1],type:"extra"}),t})():[...l(),{text:e.extraKey,type:"extra"},{text:0},{text:e.showDeleteKey?e.deleteButtonText:"",type:e.showDeleteKey?"delete":""}]),s=()=>{e.show&&o("blur")},c=()=>{o("close"),e.blurOnClose&&s()},d=()=>o(e.show?"show":"hide"),u=(t,a)=>{if(""===t)return void("extra"===a&&s());const n=e.modelValue;"delete"===a?(o("delete"),o("update:modelValue",n.slice(0,n.length-1))):"close"===a?c():n.length<+e.maxlength&&(o("input",t),o("update:modelValue",n+t))},p=()=>{if("custom"===e.theme)return t.createVNode("div",{class:$c("sidebar")},[e.showDeleteKey&&t.createVNode(zc,{large:!0,text:e.deleteButtonText,type:"delete",onPress:u},{default:a.delete}),t.createVNode(zc,{large:!0,text:e.closeButtonText,type:"close",color:"blue",loading:e.closeButtonLoading,onPress:u},null)])};return t.watch(()=>e.show,t=>{e.transition||o(t?"show":"hide")}),e.hideOnClickOutside&&H(r,s,{eventName:"touchstart"}),()=>{const o=(()=>{const{title:o,theme:n,closeButtonText:r}=e,l=a["title-left"],i=r&&"default"===n;if(o||i||l)return t.createVNode("div",{class:$c("header")},[l&&t.createVNode("span",{class:$c("title-left")},[l()]),o&&t.createVNode("h2",{class:$c("title")},[o]),i&&t.createVNode("button",{type:"button",class:[$c("close"),je],onClick:c},[r])])})(),l=t.createVNode(t.Transition,{name:e.transition?"van-slide-up":""},{default:()=>[t.withDirectives(t.createVNode("div",t.mergeProps({ref:r,style:ve(e.zIndex),class:$c({unfit:!e.safeAreaInsetBottom,"with-title":!!o}),onAnimationend:d,onTouchstartPassive:re},n),[o,t.createVNode("div",{class:$c("body")},[t.createVNode("div",{class:$c("keys")},[i.value.map(e=>{const o={};return"delete"===e.type&&(o.default=a.delete),"extra"===e.type&&(o.default=a["extra-key"]),t.createVNode(zc,{key:e.text,text:e.text,type:e.type,wider:e.wider,color:e.color,onPress:u},o)})]),p()])]),[[t.vShow,e.show]])]});return e.teleport?t.createVNode(t.Teleport,{to:e.teleport},{default:()=>[l]}):l}}})),[Fc,Rc,Hc]=Ie("pagination"),jc=(e,t,o)=>({number:e,text:t,active:o}),Wc={mode:N("multi"),prevText:String,nextText:String,pageCount:V(0),modelValue:x(0),totalItems:V(0),showPageSize:V(5),itemsPerPage:V(10),forceEllipses:Boolean,showPrevButton:b,showNextButton:b};const Uc=Ye(t.defineComponent({name:Fc,props:Wc,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.computed(()=>{const{pageCount:t,totalItems:o,itemsPerPage:a}=e,n=+t||Math.ceil(+o/+a);return Math.max(1,n)}),r=t.computed(()=>{const t=[],o=n.value,a=+e.showPageSize,{modelValue:r,forceEllipses:l}=e;let i=1,s=o;const c=a<o;c&&(i=Math.max(r-Math.floor(a/2),1),s=i+a-1,s>o&&(s=o,i=s-a+1));for(let e=i;e<=s;e++){const o=jc(e,e,e===r);t.push(o)}if(c&&a>0&&l){if(i>1){const e=jc(i-1,"...");t.unshift(e)}if(s<o){const e=jc(s+1,"...");t.push(e)}}return t}),l=(t,a)=>{t=we(t,1,n.value),e.modelValue!==t&&(o("update:modelValue",t),a&&o("change",t))};t.watchEffect(()=>l(e.modelValue));const i=()=>{const{mode:o,modelValue:n,showPrevButton:r}=e;if(!r)return;const i=a["prev-text"],s=1===n;return t.createVNode("li",{class:[Rc("item",{disabled:s,border:"simple"===o,prev:!0}),Fe]},[t.createVNode("button",{type:"button",disabled:s,onClick:()=>l(n-1,!0)},[i?i():e.prevText||Hc("prev")])])},s=()=>{const{mode:o,modelValue:r,showNextButton:i}=e;if(!i)return;const s=a["next-text"],c=r===n.value;return t.createVNode("li",{class:[Rc("item",{disabled:c,border:"simple"===o,next:!0}),Fe]},[t.createVNode("button",{type:"button",disabled:c,onClick:()=>l(r+1,!0)},[s?s():e.nextText||Hc("next")])])};return()=>t.createVNode("nav",{role:"navigation",class:Rc()},[t.createVNode("ul",{class:Rc("items")},[i(),"simple"===e.mode?t.createVNode("li",{class:Rc("page-desc")},[a.pageDesc?a.pageDesc():`${e.modelValue}/${n.value}`]):r.value.map(e=>t.createVNode("li",{class:[Rc("item",{active:e.active,page:!0}),Fe]},[t.createVNode("button",{type:"button","aria-current":e.active||void 0,onClick:()=>l(e.number,!0)},[a.page?a.page(e):e.text])])),s()])])}})),[Yc,Xc]=Ie("password-input"),qc={info:String,mask:b,value:N(""),gutter:g,length:V(6),focused:Boolean,errorInfo:String};const Gc=Ye(t.defineComponent({name:Yc,props:qc,emits:["focus"],setup(e,{emit:o}){const a=e=>{e.stopPropagation(),o("focus",e)},n=()=>{const o=[],{mask:a,value:n,gutter:r,focused:l}=e,i=+e.length;for(let e=0;e<i;e++){const i=n[e],s=0!==e&&!r,c=l&&e===n.length;let d;0!==e&&r&&(d={marginLeft:ue(r)}),o.push(t.createVNode("li",{class:[{[$e]:s},Xc("item",{focus:c})],style:d},[a?t.createVNode("i",{style:{visibility:i?"visible":"hidden"}},null):i,c&&t.createVNode("div",{class:Xc("cursor")},null)]))}return o};return()=>{const o=e.errorInfo||e.info;return t.createVNode("div",{class:Xc()},[t.createVNode("ul",{class:[Xc("security"),{[Fe]:!e.gutter}],onTouchstartPassive:a},[n()]),o&&t.createVNode("div",{class:Xc(e.errorInfo?"error-info":"info")},[o])])}}})),Zc=Ye(xa);function Kc(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function _c(e){return e instanceof Kc(e).Element||e instanceof Element}function Jc(e){return e instanceof Kc(e).HTMLElement||e instanceof HTMLElement}function Qc(e){return"undefined"!=typeof ShadowRoot&&(e instanceof Kc(e).ShadowRoot||e instanceof ShadowRoot)}var ed=Math.round;function td(){var e=navigator.userAgentData;return null!=e&&e.brands&&Array.isArray(e.brands)?e.brands.map(function(e){return e.brand+"/"+e.version}).join(" "):navigator.userAgent}function od(e,t,o){void 0===t&&(t=!1),void 0===o&&(o=!1);var a=e.getBoundingClientRect(),n=1,r=1;t&&Jc(e)&&(n=e.offsetWidth>0&&ed(a.width)/e.offsetWidth||1,r=e.offsetHeight>0&&ed(a.height)/e.offsetHeight||1);var l=(_c(e)?Kc(e):window).visualViewport,i=!!/^((?!chrome|android).)*safari/i.test(td())&&o,s=(a.left+(i&&l?l.offsetLeft:0))/n,c=(a.top+(i&&l?l.offsetTop:0))/r,d=a.width/n,u=a.height/r;return{width:d,height:u,top:c,right:s+d,bottom:c+u,left:s,x:s,y:c}}function ad(e){var t=Kc(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function nd(e){return e?(e.nodeName||"").toLowerCase():null}function rd(e){return((_c(e)?e.ownerDocument:e.document)||window.document).documentElement}function ld(e){return Kc(e).getComputedStyle(e)}function id(e){var t=ld(e),o=t.overflow,a=t.overflowX,n=t.overflowY;return/auto|scroll|overlay|hidden/.test(o+n+a)}function sd(e,t,o){void 0===o&&(o=!1);var a,n,r=Jc(t),l=Jc(t)&&function(e){var t=e.getBoundingClientRect(),o=ed(t.width)/e.offsetWidth||1,a=ed(t.height)/e.offsetHeight||1;return 1!==o||1!==a}(t),i=rd(t),s=od(e,l,o),c={scrollLeft:0,scrollTop:0},d={x:0,y:0};return(r||!r&&!o)&&(("body"!==nd(t)||id(i))&&(c=(a=t)!==Kc(a)&&Jc(a)?{scrollLeft:(n=a).scrollLeft,scrollTop:n.scrollTop}:ad(a)),Jc(t)?((d=od(t,!0)).x+=t.clientLeft,d.y+=t.clientTop):i&&(d.x=function(e){return od(rd(e)).left+ad(e).scrollLeft}(i))),{x:s.left+c.scrollLeft-d.x,y:s.top+c.scrollTop-d.y,width:s.width,height:s.height}}function cd(e){return"html"===nd(e)?e:e.assignedSlot||e.parentNode||(Qc(e)?e.host:null)||rd(e)}function dd(e){return["html","body","#document"].indexOf(nd(e))>=0?e.ownerDocument.body:Jc(e)&&id(e)?e:dd(cd(e))}function ud(e,t){var o;void 0===t&&(t=[]);var a=dd(e),n=a===(null==(o=e.ownerDocument)?void 0:o.body),r=Kc(a),l=n?[r].concat(r.visualViewport||[],id(a)?a:[]):a,i=t.concat(l);return n?i:i.concat(ud(cd(l)))}function pd(e){return["table","td","th"].indexOf(nd(e))>=0}function vd(e){return Jc(e)&&"fixed"!==ld(e).position?e.offsetParent:null}function md(e){for(var t=Kc(e),o=vd(e);o&&pd(o)&&"static"===ld(o).position;)o=vd(o);return o&&("html"===nd(o)||"body"===nd(o)&&"static"===ld(o).position)?t:o||function(e){var t=/firefox/i.test(td());if(/Trident/i.test(td())&&Jc(e)&&"fixed"===ld(e).position)return null;var o=cd(e);for(Qc(o)&&(o=o.host);Jc(o)&&["html","body"].indexOf(nd(o))<0;){var a=ld(o);if("none"!==a.transform||"none"!==a.perspective||"paint"===a.contain||-1!==["transform","perspective"].indexOf(a.willChange)||t&&"filter"===a.willChange||t&&a.filter&&"none"!==a.filter)return o;o=o.parentNode}return null}(e)||t}var fd="top",hd="bottom",gd="right",bd="left",yd="start",wd="end",xd=[].concat([fd,hd,gd,bd],["auto"]).reduce(function(e,t){return e.concat([t,t+"-"+yd,t+"-"+wd])},[]),Vd=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function Nd(e){var t=new Map,o=new Set,a=[];function n(e){o.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach(function(e){if(!o.has(e)){var a=t.get(e);a&&n(a)}}),a.push(e)}return e.forEach(function(e){t.set(e.name,e)}),e.forEach(function(e){o.has(e.name)||n(e)}),a}var Cd={placement:"bottom",modifiers:[],strategy:"absolute"};function kd(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return!t.some(function(e){return!(e&&"function"==typeof e.getBoundingClientRect)})}function Sd(e){void 0===e&&(e={});var t=e,o=t.defaultModifiers,a=void 0===o?[]:o,n=t.defaultOptions,r=void 0===n?Cd:n;return function(e,t,o){void 0===o&&(o=r);var n,l,i={placement:"bottom",orderedModifiers:[],options:Object.assign({},Cd,r),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},s=[],c=!1,d={state:i,setOptions:function(o){var n="function"==typeof o?o(i.options):o;u(),i.options=Object.assign({},r,i.options,n),i.scrollParents={reference:_c(e)?ud(e):e.contextElement?ud(e.contextElement):[],popper:ud(t)};var l,c,p=function(e){var t=Nd(e);return Vd.reduce(function(e,o){return e.concat(t.filter(function(e){return e.phase===o}))},[])}((l=[].concat(a,i.options.modifiers),c=l.reduce(function(e,t){var o=e[t.name];return e[t.name]=o?Object.assign({},o,t,{options:Object.assign({},o.options,t.options),data:Object.assign({},o.data,t.data)}):t,e},{}),Object.keys(c).map(function(e){return c[e]})));return i.orderedModifiers=p.filter(function(e){return e.enabled}),i.orderedModifiers.forEach(function(e){var t=e.name,o=e.options,a=void 0===o?{}:o,n=e.effect;if("function"==typeof n){var r=n({state:i,name:t,instance:d,options:a}),l=function(){};s.push(r||l)}}),d.update()},forceUpdate:function(){if(!c){var e=i.elements,t=e.reference,o=e.popper;if(kd(t,o)){var a,n,r,l;i.rects={reference:sd(t,md(o),"fixed"===i.options.strategy),popper:(a=o,n=od(a),r=a.offsetWidth,l=a.offsetHeight,Math.abs(n.width-r)<=1&&(r=n.width),Math.abs(n.height-l)<=1&&(l=n.height),{x:a.offsetLeft,y:a.offsetTop,width:r,height:l})},i.reset=!1,i.placement=i.options.placement,i.orderedModifiers.forEach(function(e){return i.modifiersData[e.name]=Object.assign({},e.data)});for(var s=0;s<i.orderedModifiers.length;s++)if(!0!==i.reset){var u=i.orderedModifiers[s],p=u.fn,v=u.options,m=void 0===v?{}:v,f=u.name;"function"==typeof p&&(i=p({state:i,options:m,name:f,instance:d})||i)}else i.reset=!1,s=-1}}},update:(n=function(){return new Promise(function(e){d.forceUpdate(),e(i)})},function(){return l||(l=new Promise(function(e){Promise.resolve().then(function(){l=void 0,e(n())})})),l}),destroy:function(){u(),c=!0}};if(!kd(e,t))return d;function u(){s.forEach(function(e){return e()}),s=[]}return d.setOptions(o).then(function(e){!c&&o.onFirstUpdate&&o.onFirstUpdate(e)}),d}}var Td={passive:!0};function Bd(e){return e.split("-")[0]}function Pd(e){return e.split("-")[1]}var Dd={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Od(e){var t,o=e.popper,a=e.popperRect,n=e.placement,r=e.variation,l=e.offsets,i=e.position,s=e.gpuAcceleration,c=e.adaptive,d=e.roundOffsets,u=e.isFixed,p=l.x,v=void 0===p?0:p,m=l.y,f=void 0===m?0:m,h="function"==typeof d?d({x:v,y:f}):{x:v,y:f};v=h.x,f=h.y;var g=l.hasOwnProperty("x"),b=l.hasOwnProperty("y"),y=bd,w=fd,x=window;if(c){var V=md(o),N="clientHeight",C="clientWidth";if(V===Kc(o)&&"static"!==ld(V=rd(o)).position&&"absolute"===i&&(N="scrollHeight",C="scrollWidth"),n===fd||(n===bd||n===gd)&&r===wd)w=hd,f-=(u&&V===x&&x.visualViewport?x.visualViewport.height:V[N])-a.height,f*=s?1:-1;if(n===bd||(n===fd||n===hd)&&r===wd)y=gd,v-=(u&&V===x&&x.visualViewport?x.visualViewport.width:V[C])-a.width,v*=s?1:-1}var k,S=Object.assign({position:i},c&&Dd),T=!0===d?function(e,t){var o=e.x,a=e.y,n=t.devicePixelRatio||1;return{x:ed(o*n)/n||0,y:ed(a*n)/n||0}}({x:v,y:f},Kc(o)):{x:v,y:f};return v=T.x,f=T.y,s?Object.assign({},S,((k={})[w]=b?"0":"",k[y]=g?"0":"",k.transform=(x.devicePixelRatio||1)<=1?"translate("+v+"px, "+f+"px)":"translate3d("+v+"px, "+f+"px, 0)",k)):Object.assign({},S,((t={})[w]=b?f+"px":"",t[y]=g?v+"px":"",t.transform="",t))}var Ad=Sd({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,o=e.instance,a=e.options,n=a.scroll,r=void 0===n||n,l=a.resize,i=void 0===l||l,s=Kc(t.elements.popper),c=[].concat(t.scrollParents.reference,t.scrollParents.popper);return r&&c.forEach(function(e){e.addEventListener("scroll",o.update,Td)}),i&&s.addEventListener("resize",o.update,Td),function(){r&&c.forEach(function(e){e.removeEventListener("scroll",o.update,Td)}),i&&s.removeEventListener("resize",o.update,Td)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,o=e.name;t.modifiersData[o]=function(e){var t,o=e.reference,a=e.element,n=e.placement,r=n?Bd(n):null,l=n?Pd(n):null,i=o.x+o.width/2-a.width/2,s=o.y+o.height/2-a.height/2;switch(r){case fd:t={x:i,y:o.y-a.height};break;case hd:t={x:i,y:o.y+o.height};break;case gd:t={x:o.x+o.width,y:s};break;case bd:t={x:o.x-a.width,y:s};break;default:t={x:o.x,y:o.y}}var c=r?function(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}(r):null;if(null!=c){var d="y"===c?"height":"width";switch(l){case yd:t[c]=t[c]-(o[d]/2-a[d]/2);break;case wd:t[c]=t[c]+(o[d]/2-a[d]/2)}}return t}({reference:t.rects.reference,element:t.rects.popper,placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,o=e.options,a=o.gpuAcceleration,n=void 0===a||a,r=o.adaptive,l=void 0===r||r,i=o.roundOffsets,s=void 0===i||i,c={placement:Bd(t.placement),variation:Pd(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:n,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,Od(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:l,roundOffsets:s})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,Od(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:s})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach(function(e){var o=t.styles[e]||{},a=t.attributes[e]||{},n=t.elements[e];Jc(n)&&nd(n)&&(Object.assign(n.style,o),Object.keys(a).forEach(function(e){var t=a[e];!1===t?n.removeAttribute(e):n.setAttribute(e,!0===t?"":t)}))})},effect:function(e){var t=e.state,o={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,o.popper),t.styles=o,t.elements.arrow&&Object.assign(t.elements.arrow.style,o.arrow),function(){Object.keys(t.elements).forEach(function(e){var a=t.elements[e],n=t.attributes[e]||{},r=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:o[e]).reduce(function(e,t){return e[t]="",e},{});Jc(a)&&nd(a)&&(Object.assign(a.style,r),Object.keys(n).forEach(function(e){a.removeAttribute(e)}))})}},requires:["computeStyles"]}]});const Id={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,o=e.options,a=e.name,n=o.offset,r=void 0===n?[0,0]:n,l=xd.reduce(function(e,o){return e[o]=function(e,t,o){var a=Bd(e),n=[bd,fd].indexOf(a)>=0?-1:1,r="function"==typeof o?o(Object.assign({},t,{placement:e})):o,l=r[0],i=r[1];return l=l||0,i=(i||0)*n,[bd,gd].indexOf(a)>=0?{x:i,y:l}:{x:l,y:i}}(o,t.rects,r),e},{}),i=l[t.placement],s=i.x,c=i.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=s,t.modifiersData.popperOffsets.y+=c),t.modifiersData[a]=l}},[zd,Ed]=Ie("popover"),$d=["overlay","duration","teleport","overlayStyle","overlayClass","closeOnClickOverlay"],Ld={show:Boolean,theme:N("light"),overlay:Boolean,actions:w(),actionsDirection:N("vertical"),trigger:N("click"),duration:g,showArrow:b,placement:N("bottom"),iconPrefix:String,overlayClass:h,overlayStyle:Object,closeOnClickAction:b,closeOnClickOverlay:b,closeOnClickOutside:b,offset:{type:Array,default:()=>[0,8]},teleport:{type:[String,Object],default:"body"}};const Md=Ye(t.defineComponent({name:zd,props:Ld,emits:["select","touchstart","update:show"],setup(e,{emit:o,slots:r,attrs:l}){let i;const s=t.ref(),c=t.ref(),d=t.ref(),u=Co(()=>e.show,e=>o("update:show",e)),p=()=>({placement:e.placement,modifiers:[{name:"computeStyles",options:{adaptive:!1,gpuAcceleration:!1}},a({},Id,{options:{offset:e.offset}})]}),m=()=>{t.nextTick(()=>{u.value&&(i?i.setOptions(p()):(i=c.value&&d.value?Ad(c.value,d.value.popupRef.value,p()):null,n&&(window.addEventListener("animationend",m),window.addEventListener("transitionend",m))))})},f=e=>{u.value=e},h=()=>{"click"===e.trigger&&(u.value=!u.value)},g=(o,a)=>r.action?r.action({action:o,index:a}):[o.icon&&t.createVNode(wt,{name:o.icon,classPrefix:e.iconPrefix,class:Ed("action-icon")},null),t.createVNode("div",{class:[Ed("action-text"),{[Me]:"vertical"===e.actionsDirection}]},[o.text])],b=(a,n)=>{const{icon:r,color:l,disabled:i,className:s}=a;return t.createVNode("div",{role:"menuitem",class:[Ed("action",{disabled:i,"with-icon":r}),{[Le]:"horizontal"===e.actionsDirection},s],style:{color:l},tabindex:i?void 0:0,"aria-disabled":i||void 0,onClick:()=>((t,a)=>{t.disabled||(o("select",t,a),e.closeOnClickAction&&(u.value=!1))})(a,n)},[g(a,n)])};return t.onMounted(()=>{m(),t.watchEffect(()=>{var e;s.value=null==(e=d.value)?void 0:e.popupRef.value})}),t.onBeforeUnmount(()=>{i&&(n&&(window.removeEventListener("animationend",m),window.removeEventListener("transitionend",m)),i.destroy(),i=null)}),t.watch(()=>[u.value,e.offset,e.placement],m),H([c,s],()=>{u.value&&e.closeOnClickOutside&&(!e.overlay||e.closeOnClickOverlay)&&(u.value=!1)},{eventName:"touchstart"}),()=>{var o;return t.createVNode(t.Fragment,null,[t.createVNode("span",{ref:c,class:Ed("wrapper"),onClick:h},[null==(o=r.reference)?void 0:o.call(r)]),t.createVNode(to,t.mergeProps({ref:d,show:u.value,class:Ed([e.theme]),position:"",transition:"van-popover-zoom",lockScroll:!1,"onUpdate:show":f},l,qt(),v(e,$d)),{default:()=>[e.showArrow&&t.createVNode("div",{class:Ed("arrow")},null),t.createVNode("div",{role:"menu",class:Ed("content",e.actionsDirection)},[r.default?r.default():e.actions.map(b)])]})])}}})),[Fd,Rd]=Ie("progress"),Hd={color:String,inactive:Boolean,pivotText:String,textColor:String,showPivot:b,pivotColor:String,trackColor:String,strokeWidth:g,percentage:{type:g,default:0,validator:e=>+e>=0&&+e<=100}};const jd=Ye(t.defineComponent({name:Fd,props:Hd,setup(e){const o=t.computed(()=>e.inactive?void 0:e.color),a=e=>Math.min(Math.max(+e,0),100),n=()=>{const{textColor:n,pivotText:r,pivotColor:l,percentage:i}=e,s=a(i),c=null!=r?r:`${i}%`;if(e.showPivot&&c){const a={color:n,left:`${s}%`,transform:`translate(-${s}%,-50%)`,background:l||o.value};return t.createVNode("span",{style:a,class:Rd("pivot",{inactive:e.inactive})},[c])}};return()=>{const{trackColor:r,percentage:l,strokeWidth:i}=e,s=a(l),c={background:r,height:ue(i)},d={width:`${s}%`,background:o.value};return t.createVNode("div",{class:Rd(),style:c},[t.createVNode("span",{class:Rd("portion",{inactive:e.inactive}),style:d},null),n()])}}})),[Wd,Ud,Yd]=Ie("pull-refresh"),Xd=["pulling","loosing","success"],qd={disabled:Boolean,modelValue:Boolean,headHeight:V(50),successText:String,pullingText:String,loosingText:String,loadingText:String,pullDistance:g,successDuration:V(500),animationDuration:V(300)};const Gd=Ye(t.defineComponent({name:Wd,props:qd,emits:["change","refresh","update:modelValue"],setup(e,{emit:o,slots:a}){let n;const r=t.ref(),l=t.ref(),i=G(r),s=t.reactive({status:"normal",distance:0,duration:0}),c=jt(),d=()=>{if(50!==e.headHeight)return{height:`${e.headHeight}px`}},u=()=>"loading"!==s.status&&"success"!==s.status&&!e.disabled,p=(t,a)=>{const n=+(e.pullDistance||e.headHeight);s.distance=t,s.status=a?"loading":0===t?"normal":t<n?"pulling":"loosing",o("change",{status:s.status,distance:t})},v=()=>{const{status:t}=s;return"normal"===t?"":e[`${t}Text`]||Yd(t)},m=()=>{const{status:e,distance:o}=s;if(a[e])return a[e]({distance:o});const n=[];return Xd.includes(e)&&n.push(t.createVNode("div",{class:Ud("text")},[v()])),"loading"===e&&n.push(t.createVNode(Tt,{class:Ud("loading")},{default:v})),n},f=e=>{n=0===J(i.value),n&&(s.duration=0,c.start(e))},h=e=>{u()&&f(e)},g=()=>{n&&c.deltaY.value&&u()&&(s.duration=+e.animationDuration,"loosing"===s.status?(p(+e.headHeight,!0),o("update:modelValue",!0),t.nextTick(()=>o("refresh"))):p(0))};return t.watch(()=>e.modelValue,t=>{s.duration=+e.animationDuration,t?p(+e.headHeight,!0):a.success||e.successText?(s.status="success",setTimeout(()=>{p(0)},+e.successDuration)):p(0,!1)}),R("touchmove",t=>{if(u()){n||f(t);const{deltaY:o}=c;c.move(t),n&&o.value>=0&&c.isVertical()&&(le(t),p((t=>{const o=+(e.pullDistance||e.headHeight);return t>o&&(t=t<2*o?o+(t-o)/2:1.5*o+(t-2*o)/4),Math.round(t)})(o.value)))}},{target:l}),()=>{var e;const o={transitionDuration:`${s.duration}ms`,transform:s.distance?`translate3d(0,${s.distance}px, 0)`:""};return t.createVNode("div",{ref:r,class:Ud()},[t.createVNode("div",{ref:l,class:Ud("track"),style:o,onTouchstartPassive:h,onTouchend:g,onTouchcancel:g},[t.createVNode("div",{class:Ud("head"),style:d()},[m()]),null==(e=a.default)?void 0:e.call(a)])])}}})),[Zd,Kd]=Ie("rate");const _d={size:g,icon:N("star"),color:String,count:V(5),gutter:g,clearable:Boolean,readonly:Boolean,disabled:Boolean,voidIcon:N("star-o"),allowHalf:Boolean,voidColor:String,touchable:b,iconPrefix:String,modelValue:x(0),disabledColor:String};const Jd=Ye(t.defineComponent({name:Zd,props:_d,emits:["change","update:modelValue"],setup(e,{emit:o}){const a=jt(),[n,r]=Mo(),l=t.ref(),i=t.computed(()=>e.readonly||e.disabled),s=t.computed(()=>i.value||!e.touchable),c=t.computed(()=>Array(+e.count).fill("").map((t,o)=>function(e,t,o,a){if(e>=t)return{status:"full",value:1};if(e+.5>=t&&o&&!a)return{status:"half",value:.5};if(e+1>=t&&o&&a){const o=10**10;return{status:"half",value:Math.round((e-t+1)*o)/o}}return{status:"void",value:0}}(e.modelValue,o+1,e.allowHalf,e.readonly)));let d,u,p=Number.MAX_SAFE_INTEGER,v=Number.MIN_SAFE_INTEGER;const m=()=>{u=P(l);const t=n.value.map(P);d=[],t.forEach((t,o)=>{p=Math.min(t.top,p),v=Math.max(t.top,v),e.allowHalf?d.push({score:o+.5,left:t.left,top:t.top,height:t.height},{score:o+1,left:t.left+t.width/2,top:t.top,height:t.height}):d.push({score:o+1,left:t.left,top:t.top,height:t.height})})},f=(t,o)=>{for(let e=d.length-1;e>0;e--)if(o>=u.top&&o<=u.bottom){if(t>d[e].left&&o>=d[e].top&&o<=d[e].top+d[e].height)return d[e].score}else{const a=o<u.top?p:v;if(t>d[e].left&&d[e].top===a)return d[e].score}return e.allowHalf?.5:1},h=t=>{i.value||t===e.modelValue||(o("update:modelValue",t),o("change",t))},g=e=>{s.value||(a.start(e),m())},b=(o,n)=>{const{icon:l,size:i,color:s,count:c,gutter:d,voidIcon:u,disabled:p,voidColor:v,allowHalf:g,iconPrefix:b,disabledColor:y}=e,w=n+1,x="full"===o.status,V="void"===o.status,N=g&&o.value>0&&o.value<1;let C;d&&w!==+c&&(C={paddingRight:ue(d)});return t.createVNode("div",{key:n,ref:r(n),role:"radio",style:C,class:Kd("item"),tabindex:p?void 0:0,"aria-setsize":c,"aria-posinset":w,"aria-checked":!V,onClick:t=>{m();let o=g?f(t.clientX,t.clientY):w;e.clearable&&a.isTap.value&&o===e.modelValue&&(o=0),h(o)}},[t.createVNode(wt,{size:i,name:x?l:u,class:Kd("icon",{disabled:p,full:x}),color:p?y:x?s:v,classPrefix:b},null),N&&t.createVNode(wt,{size:i,style:{width:o.value+"em"},name:V?u:l,class:Kd("icon",["half",{disabled:p,full:!V}]),color:p?y:V?v:s,classPrefix:b},null)])};return _(()=>e.modelValue),R("touchmove",e=>{if(!s.value&&(a.move(e),a.isHorizontal()&&!a.isTap.value)){const{clientX:t,clientY:o}=e.touches[0];le(e),h(f(t,o))}},{target:l}),()=>t.createVNode("div",{ref:l,role:"radiogroup",class:Kd({readonly:e.readonly,disabled:e.disabled}),tabindex:e.disabled?void 0:0,"aria-disabled":e.disabled,"aria-readonly":e.readonly,onTouchstartPassive:g},[c.value.map(b)])}})),Qd={figureArr:w(),delay:Number,duration:x(2),isStart:Boolean,direction:N("down"),height:x(40)},[eu,tu]=Ie("rolling-text-item");var ou=t.defineComponent({name:eu,props:Qd,setup(e){const o=t.computed(()=>"down"===e.direction?e.figureArr.slice().reverse():e.figureArr),a=t.computed(()=>`-${e.height*(e.figureArr.length-1)}px`),n=t.computed(()=>({lineHeight:ue(e.height)})),r=t.computed(()=>({height:ue(e.height),"--van-translate":a.value,"--van-duration":e.duration+"s","--van-delay":e.delay+"s"}));return()=>t.createVNode("div",{class:tu([e.direction]),style:r.value},[t.createVNode("div",{class:tu("box",{animate:e.isStart})},[Array.isArray(o.value)&&o.value.map(e=>t.createVNode("div",{class:tu("item"),style:n.value},[e]))])])}});const[au,nu]=Ie("rolling-text"),ru={startNum:x(0),targetNum:Number,textList:w(),duration:x(2),autoStart:b,direction:N("down"),stopOrder:N("ltr"),height:x(40)};const lu=Ye(t.defineComponent({name:au,props:ru,setup(e){const o=t.computed(()=>Array.isArray(e.textList)&&e.textList.length),a=t.computed(()=>o.value?e.textList[0].length:`${Math.max(e.startNum,e.targetNum)}`.length),n=t=>{const o=[];for(let a=0;a<e.textList.length;a++)o.push(e.textList[a][t]);return o},r=t.computed(()=>o.value?new Array(a.value).fill(""):ye(e.targetNum,a.value).split("")),l=t.computed(()=>ye(e.startNum,a.value).split("")),i=e=>{const t=+l.value[e],o=+r.value[e],a=[];for(let n=t;n<=9;n++)a.push(n);for(let n=0;n<=2;n++)for(let e=0;e<=9;e++)a.push(e);for(let n=0;n<=o;n++)a.push(n);return a},s=(t,o)=>"ltr"===e.stopOrder?.2*t:.2*(o-1-t),c=t.ref(e.autoStart),d=()=>{c.value=!0};return t.watch(()=>e.autoStart,e=>{e&&d()}),ot({start:d,reset:()=>{c.value=!1,e.autoStart&&k(()=>d())}}),()=>t.createVNode("div",{class:nu()},[r.value.map((r,l)=>t.createVNode(ou,{figureArr:o.value?n(l):i(l),duration:e.duration,direction:e.direction,isStart:c.value,height:e.height,delay:s(l,a.value)},null))])}})),iu=Ye(Fl),[su,cu,du]=Ie("search"),uu=a({},Ja,{label:String,shape:N("square"),leftIcon:N("search"),clearable:b,actionText:String,background:String,showAction:Boolean});const pu=Ye(t.defineComponent({name:su,props:uu,emits:["blur","focus","clear","search","cancel","clickInput","clickLeftIcon","clickRightIcon","update:modelValue"],setup(e,{emit:o,slots:n,attrs:r}){const l=Lo(),i=t.ref(),s=()=>{n.action||(o("update:modelValue",""),o("cancel"))},c=t=>{13===t.keyCode&&(le(t),o("search",e.modelValue))},d=()=>e.id||`${l}-input`,u=()=>{if(n.label||e.label)return t.createVNode("label",{class:cu("label"),for:d(),"data-allow-mismatch":"attribute"},[n.label?n.label():e.label])},p=()=>{if(e.showAction){const o=e.actionText||du("cancel");return t.createVNode("div",{class:cu("action"),role:"button",tabindex:0,onClick:s},[n.action?n.action():o])}},m=e=>o("blur",e),f=e=>o("focus",e),h=e=>o("clear",e),g=e=>o("clickInput",e),b=e=>o("clickLeftIcon",e),y=e=>o("clickRightIcon",e),w=Object.keys(Ja),x=()=>{const l=a({},r,v(e,w),{id:d()});return t.createVNode(en,t.mergeProps({ref:i,type:"search",class:cu("field",{"with-message":l.errorMessage}),border:!1,onBlur:m,onFocus:f,onClear:h,onKeypress:c,onClickInput:g,onClickLeftIcon:b,onClickRightIcon:y,"onUpdate:modelValue":e=>o("update:modelValue",e)},l),v(n,["left-icon","right-icon"]))};return ot({focus:()=>{var e;return null==(e=i.value)?void 0:e.focus()},blur:()=>{var e;return null==(e=i.value)?void 0:e.blur()}}),()=>{var o;return t.createVNode("div",{class:cu({"show-action":e.showAction}),style:{background:e.background}},[null==(o=n.left)?void 0:o.call(n),t.createVNode("div",{class:cu("content",e.shape)},[u(),x()]),p()])}}})),vu=[...Ht,"round","closeOnPopstate","safeAreaInsetBottom"],mu={qq:"qq",link:"link-o",weibo:"weibo",qrcode:"qr",poster:"photo-o",wechat:"wechat","weapp-qrcode":"miniprogram-o","wechat-moments":"wechat-moments"},[fu,hu,gu]=Ie("share-sheet"),bu=a({},Rt,{title:String,round:b,options:w(),cancelText:String,description:String,closeOnPopstate:b,safeAreaInsetBottom:b});const yu=Ye(t.defineComponent({name:fu,props:bu,emits:["cancel","select","update:show"],setup(e,{emit:o,slots:a}){const n=e=>o("update:show",e),r=()=>{n(!1),o("cancel")},l=()=>{const o=a.title?a.title():e.title,n=a.description?a.description():e.description;if(o||n)return t.createVNode("div",{class:hu("header")},[o&&t.createVNode("h2",{class:hu("title")},[o]),n&&t.createVNode("span",{class:hu("description")},[n])])},i=e=>{return(null==(o=e)?void 0:o.includes("/"))?t.createVNode("img",{src:e,class:hu("image-icon")},null):t.createVNode("div",{class:hu("icon",[e])},[t.createVNode(wt,{name:mu[e]||e},null)]);var o},s=(e,a)=>{const{name:n,icon:r,className:l,description:s}=e;return t.createVNode("div",{role:"button",tabindex:0,class:[hu("option"),l,je],onClick:()=>((e,t)=>o("select",e,t))(e,a)},[i(r),n&&t.createVNode("span",{class:hu("name")},[n]),s&&t.createVNode("span",{class:hu("option-description")},[s])])},c=(e,o)=>t.createVNode("div",{class:hu("options",{border:o})},[e.map(s)]),d=()=>{const{options:t}=e;return Array.isArray(t[0])?t.map((e,t)=>c(e,0!==t)):c(t)},u=()=>{var o;const n=null!=(o=e.cancelText)?o:gu("cancel");if(a.cancel||n)return t.createVNode("button",{type:"button",class:hu("cancel"),onClick:r},[a.cancel?a.cancel():n])};return()=>t.createVNode(to,t.mergeProps({class:hu(),position:"bottom","onUpdate:show":n},v(e,vu)),{default:()=>[l(),d(),u()]})}})),[wu,xu]=Ie("sidebar"),Vu=Symbol(wu),Nu={modelValue:V(0)};const Cu=Ye(t.defineComponent({name:wu,props:Nu,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const{linkChildren:n}=I(Vu),r=()=>+e.modelValue;return n({getActive:r,setActive:e=>{e!==r()&&(o("update:modelValue",e),o("change",e))}}),()=>{var e;return t.createVNode("div",{role:"tablist",class:xu()},[null==(e=a.default)?void 0:e.call(a)])}}})),[ku,Su]=Ie("sidebar-item"),Tu=a({},at,{dot:Boolean,title:String,badge:g,disabled:Boolean,badgeProps:Object});const Bu=Ye(t.defineComponent({name:ku,props:Tu,emits:["click"],setup(e,{emit:o,slots:a}){const n=rt(),{parent:r,index:l}=D(Vu);if(!r)return;const i=()=>{e.disabled||(o("click",l.value),r.setActive(l.value),n())};return()=>{const{dot:o,badge:n,title:s,disabled:c}=e,d=l.value===r.getActive();return t.createVNode("div",{role:"tab",class:Su({select:d,disabled:c}),tabindex:c?void 0:0,"aria-selected":d,onClick:i},[t.createVNode(ct,t.mergeProps({dot:o,class:Su("text"),content:n},e.badgeProps),{default:()=>[a.title?a.title():s]})])}}})),[Pu,Du,Ou]=Ie("signature"),Au={tips:String,type:N("png"),penColor:N("#000"),lineWidth:x(3),clearButtonText:String,backgroundColor:N(""),confirmButtonText:String};const Iu=Ye(t.defineComponent({name:Pu,props:Au,emits:["submit","clear","start","end","signing"],setup(e,{emit:o,slots:a}){const r=t.ref(),l=t.ref(),i=t.computed(()=>r.value?r.value.getContext("2d"):null),s=!n||(()=>{var e;const t=document.createElement("canvas");return!!(null==(e=t.getContext)?void 0:e.call(t,"2d"))})();let c,d=0,u=0;const p=()=>{if(!i.value)return!1;i.value.beginPath(),i.value.lineWidth=e.lineWidth,i.value.strokeStyle=e.penColor,c=P(r),o("start")},v=e=>{if(!i.value)return!1;le(e);const t=e.touches[0],a=t.clientX-((null==c?void 0:c.left)||0),n=t.clientY-((null==c?void 0:c.top)||0);i.value.lineCap="round",i.value.lineJoin="round",i.value.lineTo(a,n),i.value.stroke(),o("signing",e)},m=e=>{le(e),o("end")},f=t=>{t&&e.backgroundColor&&(t.fillStyle=e.backgroundColor,t.fillRect(0,0,d,u))},h=()=>{var t,a;const n=r.value;if(!n)return;const l=(t=>{const o=document.createElement("canvas");if(o.width=t.width,o.height=t.height,e.backgroundColor){const e=o.getContext("2d");f(e)}return t.toDataURL()===o.toDataURL()})(n),i=l?"":(null==(a=(t={jpg:()=>n.toDataURL("image/jpeg",.8),jpeg:()=>n.toDataURL("image/jpeg",.8)})[e.type])?void 0:a.call(t))||n.toDataURL(`image/${e.type}`);o("submit",{image:i,canvas:n})},g=()=>{i.value&&(i.value.clearRect(0,0,d,u),i.value.closePath(),f(i.value)),o("clear")},b=()=>{var e,t,o;if(s&&r.value){const a=r.value,s=n?window.devicePixelRatio:1;d=a.width=((null==(e=l.value)?void 0:e.offsetWidth)||0)*s,u=a.height=((null==(t=l.value)?void 0:t.offsetHeight)||0)*s,null==(o=i.value)||o.scale(s,s),f(i.value)}},y=()=>{if(i.value){const e=i.value.getImageData(0,0,d,u);b(),i.value.putImageData(e,0,0)}};return t.watch(se,y),t.onMounted(b),ot({resize:y,clear:g,submit:h}),()=>t.createVNode("div",{class:Du()},[t.createVNode("div",{class:Du("content"),ref:l},[s?t.createVNode("canvas",{ref:r,onTouchstartPassive:p,onTouchmove:v,onTouchend:m},null):a.tips?a.tips():t.createVNode("p",null,[e.tips])]),t.createVNode("div",{class:Du("footer")},[t.createVNode(Ot,{size:"small",onClick:g},{default:()=>[e.clearButtonText||Ou("clear")]}),t.createVNode(Ot,{type:"primary",size:"small",onClick:h},{default:()=>[e.confirmButtonText||Ou("confirm")]})])])}})),[zu,Eu]=Ie("skeleton-title"),$u={round:Boolean,titleWidth:g};const Lu=Ye(t.defineComponent({name:zu,props:$u,setup:e=>()=>t.createVNode("h3",{class:Eu([{round:e.round}]),style:{width:ue(e.titleWidth)}},null)}));var Mu=Lu;const[Fu,Ru]=Ie("skeleton-avatar"),Hu={avatarSize:g,avatarShape:N("round")};const ju=Ye(t.defineComponent({name:Fu,props:Hu,setup:e=>()=>t.createVNode("div",{class:Ru([e.avatarShape]),style:pe(e.avatarSize)},null)}));var Wu=ju;const Uu="100%",Yu={round:Boolean,rowWidth:{type:g,default:Uu}},[Xu,qu]=Ie("skeleton-paragraph");const Gu=Ye(t.defineComponent({name:Xu,props:Yu,setup:e=>()=>t.createVNode("div",{class:qu([{round:e.round}]),style:{width:e.rowWidth}},null)}));var Zu=Gu;const[Ku,_u]=Ie("skeleton"),Ju={row:V(0),round:Boolean,title:Boolean,titleWidth:g,avatar:Boolean,avatarSize:g,avatarShape:N("round"),loading:b,animate:b,rowWidth:{type:[Number,String,Array],default:Uu}};const Qu=Ye(t.defineComponent({name:Ku,inheritAttrs:!1,props:Ju,setup(e,{slots:o,attrs:a}){const n=()=>{if(e.avatar)return t.createVNode(Wu,{avatarShape:e.avatarShape,avatarSize:e.avatarSize},null)},r=()=>{if(e.title)return t.createVNode(Mu,{round:e.round,titleWidth:e.titleWidth},null)},l=t=>{const{rowWidth:o}=e;return o===Uu&&t===+e.row-1?"60%":Array.isArray(o)?o[t]:o};return()=>{var i;return e.loading?t.createVNode("div",t.mergeProps({class:_u({animate:e.animate,round:e.round})},a),[o.template?o.template():t.createVNode(t.Fragment,null,[n(),t.createVNode("div",{class:_u("content")},[r(),Array(+e.row).fill("").map((o,a)=>t.createVNode(Zu,{key:a,round:e.round,rowWidth:ue(l(a))},null))])])]):null==(i=o.default)?void 0:i.call(o)}}})),[ep,tp]=Ie("skeleton-image"),op={imageSize:g,imageShape:N("square")};const ap=Ye(t.defineComponent({name:ep,props:op,setup:e=>()=>t.createVNode("div",{class:tp([e.imageShape]),style:pe(e.imageSize)},[t.createVNode(wt,{name:"photo",class:tp("icon")},null)])})),[np,rp]=Ie("slider"),lp={min:V(0),max:V(100),step:V(1),range:Boolean,reverse:Boolean,disabled:Boolean,readonly:Boolean,vertical:Boolean,barHeight:g,buttonSize:g,activeColor:String,inactiveColor:String,modelValue:{type:[Number,Array],default:0}};const ip=Ye(t.defineComponent({name:np,props:lp,emits:["change","dragEnd","dragStart","update:modelValue"],setup(e,{emit:o,slots:a}){let n,r,l;const i=t.ref(),s=[t.ref(),t.ref()],c=t.ref(),d=jt(),u=t.computed(()=>Number(e.max)-Number(e.min)),p=t.computed(()=>{const t=e.vertical?"width":"height";return{background:e.inactiveColor,[t]:ue(e.barHeight)}}),v=t=>e.range&&Array.isArray(t),f=()=>{const{modelValue:t,min:o}=e;return v(t)?100*(t[1]-t[0])/u.value+"%":100*(t-Number(o))/u.value+"%"},h=t.computed(()=>{const t=e.vertical?"height":"width",o={[t]:f(),background:e.activeColor};c.value&&(o.transition="none");return o[e.vertical?e.reverse?"bottom":"top":e.reverse?"right":"left"]=(()=>{const{modelValue:t,min:o}=e;return v(t)?100*(t[0]-Number(o))/u.value+"%":"0%"})(),o}),g=t=>{const o=+e.min,a=+e.max,n=+e.step;t=we(t,o,a);return Ne(o,Math.round((t-o)/n)*n)},b=()=>{const t=e.modelValue;l=v(t)?t.map(g):g(t)},y=(t,a)=>{t=v(t)?(t=>{var o,a;const n=null!=(o=t[0])?o:Number(e.min),r=null!=(a=t[1])?a:Number(e.max);return n>r?[r,n]:[n,r]})(t).map(g):g(t),m(t,e.modelValue)||o("update:modelValue",t),a&&!m(t,l)&&o("change",t)},w=t=>{if(t.stopPropagation(),e.disabled||e.readonly)return;b();const{min:o,reverse:a,vertical:n,modelValue:r}=e,l=P(i),s=n?l.height:l.width,c=Number(o)+(n?a?l.bottom-t.clientY:t.clientY-l.top:a?l.right-t.clientX:t.clientX-l.left)/s*u.value;if(v(r)){const[e,t]=r;y(c<=(e+t)/2?[c,t]:[e,c],!0)}else y(c,!0)},x=t=>{if(e.disabled||e.readonly)return;"start"===c.value&&o("dragStart",t),le(t,!0),d.move(t),c.value="dragging";const a=P(i);let s=(e.vertical?d.deltaY.value:d.deltaX.value)/(e.vertical?a.height:a.width)*u.value;if(e.reverse&&(s=-s),v(l)){const t=e.reverse?1-n:n;r[t]=l[t]+s}else r=l+s;y(r)},V=t=>{e.disabled||e.readonly||("dragging"===c.value&&(y(r,!0),o("dragEnd",t)),c.value="")},N=t=>{if("number"==typeof t){return rp("button-wrapper",["left","right"][t])}return rp("button-wrapper",e.reverse?"left":"right")},C=(o,l)=>{const i="dragging"===c.value;if("number"==typeof l){const e=a[0===l?"left-button":"right-button"];let t;if(i&&Array.isArray(r)&&(t=r[0]>r[1]?1^n:n),e)return e({value:o,dragging:i,dragIndex:t})}return a.button?a.button({value:o,dragging:i}):t.createVNode("div",{class:rp("button"),style:pe(e.buttonSize)},null)},k=o=>{const a="number"==typeof o?e.modelValue[o]:e.modelValue;return t.createVNode("div",{ref:s[null!=o?o:0],role:"slider",class:N(o),tabindex:e.disabled?void 0:0,"aria-valuemin":e.min,"aria-valuenow":a,"aria-valuemax":e.max,"aria-disabled":e.disabled||void 0,"aria-readonly":e.readonly||void 0,"aria-orientation":e.vertical?"vertical":"horizontal",onTouchstartPassive:t=>{"number"==typeof o&&(n=o),(t=>{e.disabled||e.readonly||(d.start(t),r=e.modelValue,b(),c.value="start")})(t)},onTouchend:V,onTouchcancel:V,onClick:re},[C(a,o)])};return y(e.modelValue),_(()=>e.modelValue),s.forEach(e=>{R("touchmove",x,{target:e})}),()=>t.createVNode("div",{ref:i,style:p.value,class:rp({vertical:e.vertical,disabled:e.disabled}),onClick:w},[t.createVNode("div",{class:rp("bar"),style:h.value},[e.range?[k(0),k(1)]:k()])])}})),[sp,cp]=Ie("space"),dp={align:String,direction:{type:String,default:"horizontal"},size:{type:[Number,String,Array],default:8},wrap:Boolean,fill:Boolean};function up(e=[]){const o=[];return e.forEach(e=>{Array.isArray(e)?o.push(...e):e.type===t.Fragment?o.push(...up(e.children)):o.push(e)}),o.filter(e=>{var o;return!(e&&(e.type===t.Comment||e.type===t.Fragment&&0===(null==(o=e.children)?void 0:o.length)||e.type===t.Text&&""===e.children.trim()))})}const pp=Ye(t.defineComponent({name:sp,props:dp,setup(e,{slots:o}){const a=t.computed(()=>{var t;return null!=(t=e.align)?t:"horizontal"===e.direction?"center":""}),n=e=>"number"==typeof e?e+"px":e,r=t=>{const o={},a=`${n(Array.isArray(e.size)?e.size[0]:e.size)}`,r=`${n(Array.isArray(e.size)?e.size[1]:e.size)}`;return t?e.wrap?{marginBottom:r}:{}:("horizontal"===e.direction&&(o.marginRight=a),("vertical"===e.direction||e.wrap)&&(o.marginBottom=r),o)};return()=>{var n;const l=up(null==(n=o.default)?void 0:n.call(o));return t.createVNode("div",{class:[cp({[e.direction]:e.direction,[`align-${a.value}`]:a.value,wrap:e.wrap,fill:e.fill})]},[l.map((e,o)=>t.createVNode("div",{key:`item-${o}`,class:`${sp}-item`,style:r(o===l.length-1)},[e]))])}}})),[vp,mp]=Ie("steps"),fp={active:V(0),direction:N("horizontal"),activeIcon:N("checked"),iconPrefix:String,finishIcon:String,activeColor:String,inactiveIcon:String,inactiveColor:String},hp=Symbol(vp);var gp=t.defineComponent({name:vp,props:fp,emits:["clickStep"],setup(e,{emit:o,slots:a}){const{linkChildren:n}=I(hp);return n({props:e,onClickStep:e=>o("clickStep",e)}),()=>{var o;return t.createVNode("div",{class:mp([e.direction])},[t.createVNode("div",{class:mp("items")},[null==(o=a.default)?void 0:o.call(a)])])}}});const[bp,yp]=Ie("step");const wp=Ye(t.defineComponent({name:bp,setup(e,{slots:o}){const{parent:a,index:n}=D(hp);if(!a)return;const r=a.props,l=()=>{const e=+r.active;return n.value<e?"finish":n.value===e?"process":"waiting"},i=()=>"process"===l(),s=t.computed(()=>({background:"finish"===l()?r.activeColor:r.inactiveColor})),c=t.computed(()=>i()?{color:r.activeColor}:"waiting"===l()?{color:r.inactiveColor}:void 0),d=()=>a.onClickStep(n.value),u=()=>{const{iconPrefix:e,finishIcon:a,activeIcon:n,activeColor:c,inactiveIcon:d}=r;return i()?o["active-icon"]?o["active-icon"]():t.createVNode(wt,{class:yp("icon","active"),name:n,color:c,classPrefix:e},null):"finish"===l()&&(a||o["finish-icon"])?o["finish-icon"]?o["finish-icon"]():t.createVNode(wt,{class:yp("icon","finish"),name:a,color:c,classPrefix:e},null):o["inactive-icon"]?o["inactive-icon"]():d?t.createVNode(wt,{class:yp("icon"),name:d,classPrefix:e},null):t.createVNode("i",{class:yp("circle"),style:s.value},null)};return()=>{var e;const a=l();return t.createVNode("div",{class:[ze,yp([r.direction,{[a]:a}])]},[t.createVNode("div",{class:yp("title",{active:i()}),style:c.value,onClick:d},[null==(e=o.default)?void 0:e.call(o)]),t.createVNode("div",{class:yp("circle-container"),onClick:d},[u()]),t.createVNode("div",{class:yp("line"),style:s.value},null)])}}})),[xp,Vp]=Ie("stepper"),Np=(e,t)=>String(e)===String(t),Cp={min:V(1),max:V(1/0),name:V(""),step:V(1),theme:String,integer:Boolean,disabled:Boolean,showPlus:b,showMinus:b,showInput:b,longPress:b,autoFixed:b,allowEmpty:Boolean,modelValue:g,inputWidth:g,buttonSize:g,placeholder:String,disablePlus:Boolean,disableMinus:Boolean,disableInput:Boolean,beforeChange:Function,defaultValue:V(1),decimalLength:g};const kp=Ye(t.defineComponent({name:xp,props:Cp,emits:["plus","blur","minus","focus","change","overlimit","update:modelValue"],setup(e,{emit:o}){const a=(t,o=!0)=>{const{min:a,max:n,allowEmpty:r,decimalLength:i}=e;return r&&""===t||(t=""===(t=Ve(String(t),!e.integer))?0:+t,t=Number.isNaN(t)?+a:t,t=o?Math.max(Math.min(+n,t),+a):t,l(i)&&(t=t.toFixed(+i))),t};let n;const r=t.ref(),i=t.ref((()=>{var t;const n=null!=(t=e.modelValue)?t:e.defaultValue,r=a(n);return Np(r,e.modelValue)||o("update:modelValue",r),r})()),s=t.computed(()=>e.disabled||e.disableMinus||+i.value<=+e.min),c=t.computed(()=>e.disabled||e.disablePlus||+i.value>=+e.max),d=t.computed(()=>({width:ue(e.inputWidth),height:ue(e.buttonSize)})),u=t.computed(()=>pe(e.buttonSize)),p=t=>{e.beforeChange?Ue(e.beforeChange,{args:[t],done(){i.value=t}}):i.value=t},v=()=>{if("plus"===n&&c.value||"minus"===n&&s.value)return void o("overlimit",n);const t="minus"===n?-e.step:+e.step,r=a(Ne(+i.value,t));p(r),o(n)},m=t=>{const o=t.target,{value:a}=o,{decimalLength:n}=e;let r=Ve(String(a),!e.integer);if(l(n)&&r.includes(".")){const e=r.split(".");r=`${e[0]}.${e[1].slice(0,+n)}`}e.beforeChange?o.value=String(i.value):Np(a,r)||(o.value=r);const s=r===String(+r);p(s?+r:r)},f=t=>{var a;e.disableInput?null==(a=r.value)||a.blur():o("focus",t)},h=n=>{const r=n.target,l=a(r.value,e.autoFixed);r.value=String(l),i.value=l,t.nextTick(()=>{o("blur",n),ne()})};let g,b;const y=()=>{b=setTimeout(()=>{v(),y()},200)},w=t=>{e.longPress&&(clearTimeout(b),g&&le(t))},x=t=>{e.disableInput&&le(t)},V=t=>({onClick:e=>{le(e),n=t,v()},onTouchstartPassive:()=>{n=t,e.longPress&&(g=!1,clearTimeout(b),b=setTimeout(()=>{g=!0,v(),y()},500))},onTouchend:w,onTouchcancel:w});return t.watch(()=>[e.max,e.min,e.integer,e.decimalLength],()=>{const e=a(i.value);Np(e,i.value)||(i.value=e)}),t.watch(()=>e.modelValue,e=>{Np(e,i.value)||(i.value=a(e))}),t.watch(i,t=>{o("update:modelValue",t),o("change",t,{name:e.name})}),_(()=>e.modelValue),()=>t.createVNode("div",{role:"group",class:Vp([e.theme])},[t.withDirectives(t.createVNode("button",t.mergeProps({type:"button",style:u.value,class:[Vp("minus",{disabled:s.value}),{[je]:!s.value}],"aria-disabled":s.value||void 0},V("minus")),null),[[t.vShow,e.showMinus]]),t.withDirectives(t.createVNode("input",{ref:r,type:e.integer?"tel":"text",role:"spinbutton",class:Vp("input"),value:i.value,style:d.value,disabled:e.disabled,readonly:e.disableInput,inputmode:e.integer?"numeric":"decimal",placeholder:e.placeholder,autocomplete:"off","aria-valuemax":e.max,"aria-valuemin":e.min,"aria-valuenow":i.value,onBlur:h,onInput:m,onFocus:f,onMousedown:x},null),[[t.vShow,e.showInput]]),t.withDirectives(t.createVNode("button",t.mergeProps({type:"button",style:u.value,class:[Vp("plus",{disabled:c.value}),{[je]:!c.value}],"aria-disabled":c.value||void 0},V("plus")),null),[[t.vShow,e.showPlus]])])}})),Sp=Ye(gp),[Tp,Bp,Pp]=Ie("submit-bar"),Dp={tip:String,label:String,price:Number,tipIcon:String,loading:Boolean,currency:N("¥"),disabled:Boolean,textAlign:String,buttonText:String,buttonType:N("danger"),buttonColor:String,suffixLabel:String,placeholder:Boolean,decimalLength:V(2),safeAreaInsetBottom:b};const Op=Ye(t.defineComponent({name:Tp,props:Dp,emits:["submit"],setup(e,{emit:o,slots:a}){const n=t.ref(),r=Ke(n,Bp),l=()=>{const{price:o,label:a,currency:n,textAlign:r,suffixLabel:l,decimalLength:i}=e;if("number"==typeof o){const e=(o/100).toFixed(+i).split("."),s=i?`.${e[1]}`:"";return t.createVNode("div",{class:Bp("text"),style:{textAlign:r}},[t.createVNode("span",null,[a||Pp("label")]),t.createVNode("span",{class:Bp("price")},[n,t.createVNode("span",{class:Bp("price-integer")},[e[0]]),s]),l&&t.createVNode("span",{class:Bp("suffix-label")},[l])])}},i=()=>{var o;const{tip:n,tipIcon:r}=e;if(a.tip||n)return t.createVNode("div",{class:Bp("tip")},[r&&t.createVNode(wt,{class:Bp("tip-icon"),name:r},null),n&&t.createVNode("span",{class:Bp("tip-text")},[n]),null==(o=a.tip)?void 0:o.call(a)])},s=()=>o("submit"),c=()=>{var o,r;return t.createVNode("div",{ref:n,class:[Bp(),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[null==(o=a.top)?void 0:o.call(a),i(),t.createVNode("div",{class:Bp("bar")},[null==(r=a.default)?void 0:r.call(a),l(),a.button?a.button():t.createVNode(Ot,{round:!0,type:e.buttonType,text:e.buttonText,class:Bp("button",e.buttonType),color:e.buttonColor,loading:e.loading,disabled:e.disabled,onClick:s},null)])])};return()=>e.placeholder?r(c):c()}})),[Ap,Ip]=Ie("swipe-cell"),zp={name:V(""),disabled:Boolean,leftWidth:g,rightWidth:g,beforeClose:Function,stopPropagation:Boolean};const Ep=Ye(t.defineComponent({name:Ap,props:zp,emits:["open","close","click"],setup(e,{emit:o,slots:a}){let n,r,i,s;const c=t.ref(),d=t.ref(),u=t.ref(),p=t.reactive({offset:0,dragging:!1}),v=jt(),m=e=>e.value?P(e).width:0,f=t.computed(()=>l(e.leftWidth)?+e.leftWidth:m(d)),h=t.computed(()=>l(e.rightWidth)?+e.rightWidth:m(u)),g=t=>{p.offset="left"===t?f.value:-h.value,n||(n=!0,o("open",{name:e.name,position:t}))},b=t=>{p.offset=0,n&&(n=!1,o("close",{name:e.name,position:t}))},y=t=>{e.disabled||(i=p.offset,v.start(t))},w=()=>{p.dragging&&(p.dragging=!1,(e=>{const t=Math.abs(p.offset),o=n?.85:.15,a="left"===e?f.value:h.value;a&&t>a*o?g(e):b(e)})(p.offset>0?"left":"right"),setTimeout(()=>{r=!1},0))},x=(t="outside",a)=>{s||(o("click",t),n&&!r&&(s=!0,Ue(e.beforeClose,{args:[{event:a,name:e.name,position:t}],done:()=>{s=!1,b(t)},canceled:()=>s=!1,error:()=>s=!1})))},V=e=>t=>{(r||n)&&t.stopPropagation(),r||x(e,t)},N=(e,o)=>{const n=a[e];if(n)return t.createVNode("div",{ref:o,class:Ip(e),onClick:V(e)},[n()])};return ot({open:g,close:b}),H(c,e=>x("outside",e),{eventName:"touchstart"}),R("touchmove",t=>{if(e.disabled)return;const{deltaX:o}=v;if(v.move(t),v.isHorizontal()){r=!0,p.dragging=!0;(!n||o.value*i<0)&&le(t,e.stopPropagation),p.offset=we(o.value+i,-h.value,f.value)}},{target:c}),()=>{var e;const o={transform:`translate3d(${p.offset}px, 0, 0)`,transitionDuration:p.dragging?"0s":".6s"};return t.createVNode("div",{ref:c,class:Ip(),onClick:V("cell"),onTouchstartPassive:y,onTouchend:w,onTouchcancel:w},[t.createVNode("div",{class:Ip("wrapper"),style:o},[N("left",d),null==(e=a.default)?void 0:e.call(a),N("right",u)])])}}})),[$p,Lp]=Ie("tabbar"),Mp={route:Boolean,fixed:b,border:b,zIndex:g,placeholder:Boolean,activeColor:String,beforeChange:Function,inactiveColor:String,modelValue:V(0),safeAreaInsetBottom:{type:Boolean,default:null}},Fp=Symbol($p);const Rp=Ye(t.defineComponent({name:$p,props:Mp,emits:["change","update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.ref(),{linkChildren:r}=I(Fp),l=Ke(n,Lp),i=()=>{var t;return null!=(t=e.safeAreaInsetBottom)?t:e.fixed},s=()=>{var o;const{fixed:r,zIndex:l,border:s}=e;return t.createVNode("div",{ref:n,role:"tablist",style:ve(l),class:[Lp({fixed:r}),{[Re]:s,"van-safe-area-bottom":i()}]},[null==(o=a.default)?void 0:o.call(a)])};return r({props:e,setActive:(t,a)=>{Ue(e.beforeChange,{args:[t],done(){o("update:modelValue",t),o("change",t),a()}})}}),()=>e.fixed&&e.placeholder?l(s):s()}})),[Hp,jp]=Ie("tabbar-item"),Wp=a({},at,{dot:Boolean,icon:String,name:g,badge:g,badgeProps:Object,iconPrefix:String});const Up=Ye(t.defineComponent({name:Hp,props:Wp,emits:["click"],setup(e,{emit:o,slots:a}){const n=rt(),l=t.getCurrentInstance().proxy,{parent:i,index:s}=D(Fp);if(!i)return;const c=t.computed(()=>{var t;const{route:o,modelValue:a}=i.props;if(o&&"$route"in l){const{$route:t}=l,{to:o}=e,a=r(o)?o:{path:o};return t.matched.some(e=>{const t="path"in a&&a.path===e.path,o="name"in a&&a.name===e.name;return t||o})}return(null!=(t=e.name)?t:s.value)===a}),d=t=>{var a;c.value||i.setActive(null!=(a=e.name)?a:s.value,n),o("click",t)},u=()=>a.icon?a.icon({active:c.value}):e.icon?t.createVNode(wt,{name:e.icon,classPrefix:e.iconPrefix},null):void 0;return()=>{var o;const{dot:n,badge:r}=e,{activeColor:l,inactiveColor:s}=i.props,p=c.value?l:s;return t.createVNode("div",{role:"tab",class:jp({active:c.value}),style:{color:p},tabindex:0,"aria-selected":c.value,onClick:d},[t.createVNode(ct,t.mergeProps({dot:n,class:jp("icon"),content:r},e.badgeProps),{default:u}),t.createVNode("div",{class:jp("text")},[null==(o=a.default)?void 0:o.call(a,{active:c.value})])])}}})),[Yp,Xp]=Ie("text-ellipsis"),qp={rows:V(1),dots:N("..."),content:N(""),expandText:N(""),collapseText:N(""),position:N("end")};const Gp=Ye(t.defineComponent({name:Yp,props:qp,emits:["clickAction"],setup(e,{emit:o,slots:a}){const n=t.ref(e.content),r=t.ref(!1),l=t.ref(!1),i=t.ref(),s=t.ref();let c=!1;const d=t.computed(()=>r.value?e.collapseText:e.expandText),u=e=>{if(!e)return 0;const t=e.match(/^\d*(\.\d*)?/);return t?Number(t[0]):0},p=()=>{const t=(()=>{if(!i.value||!i.value.isConnected)return;const t=window.getComputedStyle(i.value),o=document.createElement("div");return Array.prototype.slice.apply(t).forEach(e=>{o.style.setProperty(e,t.getPropertyValue(e))}),o.style.position="fixed",o.style.zIndex="-9999",o.style.top="-9999px",o.style.height="auto",o.style.minHeight="auto",o.style.maxHeight="auto",o.innerText=e.content,document.body.appendChild(o),o})();if(!t)return void(c=!0);const{paddingBottom:o,paddingTop:r,lineHeight:d}=t.style,p=Math.ceil((Number(e.rows)+.5)*u(d)+u(r)+u(o));p<t.offsetHeight?(l.value=!0,n.value=((t,o)=>{var n,r;const{content:l,position:i,dots:c}=e,d=l.length,u=0+d>>1,p=a.action?null!=(r=null==(n=s.value)?void 0:n.outerHTML)?r:"":e.expandText,v=(a,n)=>{if(a[1]-a[0]<=1&&n[1]-n[0]<=1)return l.slice(0,a[0])+c+l.slice(n[1],d);const r=Math.floor((a[0]+a[1])/2),i=Math.ceil((n[0]+n[1])/2);return t.innerText=e.content.slice(0,r)+e.dots+e.content.slice(i,d),t.innerHTML+=p,t.offsetHeight>=o?v([a[0],r],[i,n[1]]):v([r,a[1]],[n[0],i])};return"middle"===e.position?v([0,u],[u,d]):(()=>{const e=(a,n)=>{if(n-a<=1)return"end"===i?l.slice(0,a)+c:c+l.slice(n,d);const r=Math.round((a+n)/2);return t.innerText="end"===i?l.slice(0,r)+c:c+l.slice(r,d),t.innerHTML+=p,t.offsetHeight>o?"end"===i?e(a,r):e(r,n):"end"===i?e(r,n):e(a,r)};return e(0,d)})()})(t,p)):(l.value=!1,n.value=e.content),document.body.removeChild(t)},v=(e=!r.value)=>{r.value=e},m=e=>{v(),o("clickAction",e)},f=()=>{const e=a.action?a.action({expanded:r.value}):d.value;return t.createVNode("span",{ref:s,class:Xp("action"),onClick:m},[e])};return t.onMounted(()=>{p(),a.action&&t.nextTick(p)}),t.onActivated(()=>{c&&(c=!1,p())}),t.watch([se,()=>[e.content,e.rows,e.position]],p),ot({toggle:v}),()=>t.createVNode("div",{ref:i,class:Xp()},[r.value?e.content:n.value,l.value?f():null])}})),[Zp]=Ie("time-picker"),Kp=e=>/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(e),_p=["hour","minute","second"],Jp=a({},Jr,{minHour:V(0),maxHour:V(23),minMinute:V(0),maxMinute:V(59),minSecond:V(0),maxSecond:V(59),minTime:{type:String,validator:Kp},maxTime:{type:String,validator:Kp},columnsType:{type:Array,default:()=>["hour","minute"]}});const Qp=Ye(t.defineComponent({name:Zp,props:Jp,emits:["confirm","cancel","change","update:modelValue"],setup(e,{emit:o,slots:a}){const n=t.ref(e.modelValue),r=t.ref(),l=t=>{const o=t.split(":");return _p.map((t,a)=>e.columnsType.includes(t)?o[a]:"00")},i=t.computed(()=>{let{minHour:t,maxHour:o,minMinute:a,maxMinute:r,minSecond:i,maxSecond:s}=e;if(e.minTime||e.maxTime){const c={hour:0,minute:0,second:0};e.columnsType.forEach((e,t)=>{var o;c[e]=null!=(o=n.value[t])?o:0});const{hour:d,minute:u}=c;if(e.minTime){const[o,n,r]=l(e.minTime);t=o,a=+d<=+t?n:"00",i=+d<=+t&&+u<=+a?r:"00"}if(e.maxTime){const[t,a,n]=l(e.maxTime);o=t,r=+d>=+o?a:"59",s=+d>=+o&&+u>=+r?n:"59"}}return e.columnsType.map(l=>{const{filter:c,formatter:d}=e;switch(l){case"hour":return tl(+t,+o,l,d,c,n.value);case"minute":return tl(+a,+r,l,d,c,n.value);case"second":return tl(+i,+s,l,d,c,n.value);default:return[]}})});t.watch(n,t=>{m(t,e.modelValue)||o("update:modelValue",t)}),t.watch(()=>e.modelValue,e=>{e=ol(e,i.value),m(e,n.value)||(n.value=e)},{immediate:!0});const s=(...e)=>o("change",...e),c=(...e)=>o("cancel",...e),d=(...e)=>o("confirm",...e);return ot({confirm:()=>{var e;return null==(e=r.value)?void 0:e.confirm()},getSelectedTime:()=>n.value}),()=>t.createVNode(Da,t.mergeProps({ref:r,modelValue:n.value,"onUpdate:modelValue":e=>n.value=e,columns:i.value,onChange:s,onCancel:c,onConfirm:d},v(e,Qr)),a)}})),[ev,tv]=Ie("tree-select"),ov={max:V(1/0),items:w(),height:V(300),selectedIcon:N("success"),mainActiveIndex:V(0),activeId:{type:[Number,String,Array],default:0}};const av=Ye(t.defineComponent({name:ev,props:ov,emits:["clickNav","clickItem","update:activeId","update:mainActiveIndex"],setup(e,{emit:o,slots:a}){const n=t=>Array.isArray(e.activeId)?e.activeId.includes(t):e.activeId===t,r=a=>t.createVNode("div",{key:a.id,class:["van-ellipsis",tv("item",{active:n(a.id),disabled:a.disabled})],onClick:()=>{if(a.disabled)return;let t;if(Array.isArray(e.activeId)){t=e.activeId.slice();const o=t.indexOf(a.id);-1!==o?t.splice(o,1):t.length<+e.max&&t.push(a.id)}else t=a.id;o("update:activeId",t),o("clickItem",a)}},[a.text,n(a.id)&&t.createVNode(wt,{name:e.selectedIcon,class:tv("selected")},null)]),l=e=>{o("update:mainActiveIndex",e)},i=e=>o("clickNav",e),s=()=>{const o=e.items.map(e=>t.createVNode(Bu,{dot:e.dot,badge:e.badge,class:[tv("nav-item"),e.className],disabled:e.disabled,onClick:i},{title:()=>a["nav-text"]?a["nav-text"](e):e.text}));return t.createVNode(Cu,{class:tv("nav"),modelValue:e.mainActiveIndex,onChange:l},{default:()=>[o]})},c=()=>{if(a.content)return a.content();const t=e.items[+e.mainActiveIndex]||{};return t.children?t.children.map(r):void 0};return()=>t.createVNode("div",{class:tv(),style:{height:ue(e.height)}},[s(),t.createVNode("div",{class:tv("content")},[c()])])}})),[nv,rv,lv]=Ie("uploader");function iv(e,t){return new Promise(o=>{if("file"===t)return void o();const a=new FileReader;a.onload=e=>{o(e.target.result)},"dataUrl"===t?a.readAsDataURL(e):"text"===t&&a.readAsText(e)})}function sv(e,t){return f(e).some(e=>!!e.file&&(i(t)?t(e.file):e.file.size>+t))}const cv=/\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i;function dv(e){return!!e.isImage||(e.file&&e.file.type?0===e.file.type.indexOf("image"):e.url?(t=e.url,cv.test(t)):"string"==typeof e.content&&0===e.content.indexOf("data:image"));var t}var uv=t.defineComponent({props:{name:g,item:y(Object),index:Number,imageFit:String,lazyLoad:Boolean,deletable:Boolean,reupload:Boolean,previewSize:[Number,String,Array],beforeDelete:Function},emits:["delete","preview","reupload"],setup(e,{emit:o,slots:n}){const r=()=>{const{status:o,message:a}=e.item;if("uploading"===o||"failed"===o){const e="failed"===o?t.createVNode(wt,{name:"close",class:rv("mask-icon")},null):t.createVNode(Tt,{class:rv("loading")},null),n=l(a)&&""!==a;return t.createVNode("div",{class:rv("mask")},[e,n&&t.createVNode("div",{class:rv("mask-message")},[a])])}},i=t=>{const{name:a,item:n,index:r,beforeDelete:l}=e;t.stopPropagation(),Ue(l,{args:[n,{name:a,index:r}],done:()=>o("delete")})},s=()=>o("preview"),c=()=>o("reupload"),d=()=>{if(e.deletable&&"uploading"!==e.item.status){const e=n["preview-delete"];return t.createVNode("div",{role:"button",class:rv("preview-delete",{shadow:!e}),tabindex:0,"aria-label":lv("delete"),onClick:i},[e?e():t.createVNode(wt,{name:"cross",class:rv("preview-delete-icon")},null)])}},u=()=>{if(n["preview-cover"]){const{index:o,item:r}=e;return t.createVNode("div",{class:rv("preview-cover")},[n["preview-cover"](a({index:o},r))])}},p=()=>{const{item:o,lazyLoad:a,imageFit:n,previewSize:r,reupload:l}=e;return dv(o)?t.createVNode(fl,{fit:n,src:o.objectUrl||o.content||o.url,class:rv("preview-image"),width:Array.isArray(r)?r[0]:r,height:Array.isArray(r)?r[1]:r,lazyLoad:a,onClick:l?c:s},{default:u}):t.createVNode("div",{class:rv("file"),style:pe(e.previewSize)},[t.createVNode(wt,{class:rv("file-icon"),name:"description"},null),t.createVNode("div",{class:[rv("file-name"),"van-ellipsis"]},[o.file?o.file.name:o.url]),u()])};return()=>t.createVNode("div",{class:rv("preview")},[p(),r(),d()])}});const pv={name:V(""),accept:N("image/*"),capture:String,multiple:Boolean,disabled:Boolean,readonly:Boolean,lazyLoad:Boolean,maxCount:V(1/0),imageFit:N("cover"),resultType:N("dataUrl"),uploadIcon:N("photograph"),uploadText:String,deletable:b,reupload:Boolean,afterRead:Function,showUpload:b,modelValue:w(),beforeRead:Function,beforeDelete:Function,previewSize:[Number,String,Array],previewImage:b,previewOptions:Object,previewFullImage:b,maxSize:{type:[Number,String,Function],default:1/0}};const vv=Ye(t.defineComponent({name:nv,props:pv,emits:["delete","oversize","clickUpload","closePreview","clickPreview","clickReupload","update:modelValue"],setup(e,{emit:o,slots:n}){const r=t.ref(),l=[],i=t.ref(-1),c=t.ref(!1),d=(t=e.modelValue.length)=>({name:e.name,index:t}),u=()=>{r.value&&(r.value.value="")},p=a=>{if(u(),sv(a,e.maxSize)){if(!Array.isArray(a))return void o("oversize",a,d());{const t=function(e,t){const o=[],a=[];return e.forEach(e=>{sv(e,t)?a.push(e):o.push(e)}),{valid:o,invalid:a}}(a,e.maxSize);if(a=t.valid,o("oversize",t.invalid,d()),!a.length)return}}if(a=t.reactive(a),i.value>-1){const t=[...e.modelValue];t.splice(i.value,1,a),o("update:modelValue",t),i.value=-1}else o("update:modelValue",[...e.modelValue,...f(a)]);e.afterRead&&e.afterRead(a,d())},m=t=>{const{maxCount:o,modelValue:a,resultType:n}=e;if(Array.isArray(t)){const e=+o-a.length;t.length>e&&(t=t.slice(0,e)),Promise.all(t.map(e=>iv(e,n))).then(e=>{const o=t.map((t,o)=>{const a={file:t,status:"",message:"",objectUrl:URL.createObjectURL(t)};return e[o]&&(a.content=e[o]),a});p(o)})}else iv(t,n).then(e=>{const o={file:t,status:"",message:"",objectUrl:URL.createObjectURL(t)};e&&(o.content=e),p(o)})},h=t=>{const{files:o}=t.target;if(e.disabled||!o||!o.length)return;const a=1===o.length?o[0]:[].slice.call(o);if(e.beforeRead){const t=e.beforeRead(a,d());if(!t)return void u();if(s(t))return void t.then(e=>{m(e||a)}).catch(u)}m(a)};let g;const b=()=>o("closePreview"),y=e=>{c.value=!0,i.value=e,t.nextTick(()=>k())},w=()=>{c.value||(i.value=-1),c.value=!1},x=(r,i)=>{const s=["imageFit","deletable","reupload","previewSize","beforeDelete"],c=a(v(e,s),v(r,s,!0));return t.createVNode(uv,t.mergeProps({item:r,index:i,onClick:()=>o(e.reupload?"clickReupload":"clickPreview",r,d(i)),onDelete:()=>((t,a)=>{const n=e.modelValue.slice(0);n.splice(a,1),o("update:modelValue",n),o("delete",t,d(a))})(r,i),onPreview:()=>(t=>{if(e.previewFullImage){const o=e.modelValue.filter(dv),n=o.map(e=>(e.objectUrl&&!e.url&&"failed"!==e.status&&(e.url=e.objectUrl,l.push(e.url)),e.url)).filter(Boolean);g=Zs(a({images:n,startPosition:o.indexOf(t),onClose:b},e.previewOptions))}})(r),onReupload:()=>y(i)},v(e,["name","lazyLoad"]),c),v(n,["preview-cover","preview-delete"]))},V=()=>{if(e.previewImage)return e.modelValue.map(x)},N=e=>o("clickUpload",e),C=()=>{const o=e.modelValue.length<+e.maxCount,a=e.readonly?null:t.createVNode("input",{ref:r,type:"file",class:rv("input"),accept:e.accept,capture:e.capture,multiple:e.multiple&&-1===i.value,disabled:e.disabled,onChange:h,onClick:w},null);return n.default?t.withDirectives(t.createVNode("div",{class:rv("input-wrapper"),onClick:N},[n.default(),a]),[[t.vShow,o]]):t.withDirectives(t.createVNode("div",{class:rv("upload",{readonly:e.readonly}),style:pe(e.previewSize),onClick:N},[t.createVNode(wt,{name:e.uploadIcon,class:rv("upload-icon")},null),e.uploadText&&t.createVNode("span",{class:rv("upload-text")},[e.uploadText]),a]),[[t.vShow,e.showUpload&&o]])},k=()=>{r.value&&!e.disabled&&r.value.click()};return t.onBeforeUnmount(()=>{l.forEach(e=>URL.revokeObjectURL(e))}),ot({chooseFile:k,reuploadFile:y,closeImagePreview:()=>{g&&g.close()}}),_(()=>e.modelValue),()=>t.createVNode("div",{class:rv()},[t.createVNode("div",{class:rv("wrapper",{disabled:e.disabled})},[V(),C()])])}})),[mv,fv]=Ie("watermark"),hv={gapX:x(0),gapY:x(0),image:String,width:x(100),height:x(100),rotate:V(-22),zIndex:g,content:String,opacity:g,fullPage:b,textColor:N("#dcdee0")};const gv=Ye(t.defineComponent({name:mv,props:hv,setup(e,{slots:o}){const n=t.ref(),r=t.ref(""),l=t.ref(""),i=()=>{const a={transformOrigin:"center",transform:`rotate(${e.rotate}deg)`},n=e.width+e.gapX,r=e.height+e.gapY;return t.createVNode("svg",{viewBox:`0 0 ${n} ${r}`,width:n,height:r,xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",style:{padding:`0 ${e.gapX}px ${e.gapY}px 0`,opacity:e.opacity}},[e.image&&!o.content?t.createVNode("image",{href:l.value,"xlink:href":l.value,x:"0",y:"0",width:e.width,height:e.height,style:a},null):t.createVNode("foreignObject",{x:"0",y:"0",width:e.width,height:e.height},[t.createVNode("div",{xmlns:"http://www.w3.org/1999/xhtml",style:a},[o.content?o.content():t.createVNode("span",{style:{color:e.textColor}},[e.content])])])])},s=()=>{r.value&&URL.revokeObjectURL(r.value)},c=()=>{n.value&&(s(),r.value=(e=>{const t=new Blob([e],{type:"image/svg+xml"});return URL.createObjectURL(t)})(n.value.innerHTML))};return t.watchEffect(()=>{e.image&&(e=>{const t=document.createElement("canvas"),o=new Image;o.crossOrigin="anonymous",o.referrerPolicy="no-referrer",o.onload=()=>{t.width=o.naturalWidth,t.height=o.naturalHeight;const e=t.getContext("2d");null==e||e.drawImage(o,0,0),l.value=t.toDataURL()},o.src=e})(e.image)}),t.watch(()=>[e.content,e.textColor,e.height,e.width,e.rotate,e.gapX,e.gapY],c),t.watch(l,()=>{t.nextTick(c)}),t.onMounted(c),t.onUnmounted(s),()=>{const o=a({backgroundImage:`url(${r.value})`},ve(e.zIndex));return t.createVNode("div",{class:fv({full:e.fullPage}),style:o},[t.createVNode("div",{class:fv("wrapper"),ref:n},[i()])])}}}));class bv{constructor({el:e,src:t,error:o,loading:a,bindType:n,$parent:r,options:l,cors:i,elRenderer:s,imageCache:c}){this.el=e,this.src=t,this.error=o,this.loading=a,this.bindType=n,this.attempt=0,this.cors=i,this.naturalHeight=0,this.naturalWidth=0,this.options=l,this.$parent=r,this.elRenderer=s,this.imageCache=c,this.performanceData={loadStart:0,loadEnd:0},this.filter(),this.initState(),this.render("loading",!1)}initState(){"dataset"in this.el?this.el.dataset.src=this.src:this.el.setAttribute("data-src",this.src),this.state={loading:!1,error:!1,loaded:!1,rendered:!1}}record(e){this.performanceData[e]=Date.now()}update({src:e,loading:t,error:o}){const a=this.src;this.src=e,this.loading=t,this.error=o,this.filter(),a!==this.src&&(this.attempt=0,this.initState())}checkInView(){const e=P(this.el);return e.top<window.innerHeight*this.options.preLoad&&e.bottom>this.options.preLoadTop&&e.left<window.innerWidth*this.options.preLoad&&e.right>0}filter(){Object.keys(this.options.filter).forEach(e=>{this.options.filter[e](this,this.options)})}renderLoading(e){this.state.loading=!0,kr({src:this.loading,cors:this.cors},()=>{this.render("loading",!1),this.state.loading=!1,e()},()=>{e(),this.state.loading=!1})}load(e=o){if(this.attempt>this.options.attempt-1&&this.state.error)e();else if(!this.state.rendered||!this.state.loaded)return this.imageCache.has(this.src)?(this.state.loaded=!0,this.render("loaded",!0),this.state.rendered=!0,e()):void this.renderLoading(()=>{var t,o;this.attempt++,null==(o=(t=this.options.adapter).beforeLoad)||o.call(t,this,this.options),this.record("loadStart"),kr({src:this.src,cors:this.cors},t=>{this.naturalHeight=t.naturalHeight,this.naturalWidth=t.naturalWidth,this.state.loaded=!0,this.state.error=!1,this.record("loadEnd"),this.render("loaded",!1),this.state.rendered=!0,this.imageCache.add(this.src),e()},e=>{!this.options.silent&&console.error(e),this.state.error=!0,this.state.loaded=!1,this.render("error",!1)})})}render(e,t){this.elRenderer(this,e,t)}performance(){let e="loading",t=0;return this.state.loaded&&(e="loaded",t=(this.performanceData.loadEnd-this.performanceData.loadStart)/1e3),this.state.error&&(e="error"),{src:this.src,state:e,time:t}}$destroy(){this.el=null,this.src=null,this.error=null,this.loading=null,this.bindType=null,this.attempt=0}}const yv="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",wv=["scroll","wheel","mousewheel","resize","animationend","transitionend","touchmove"],xv={rootMargin:"0px",threshold:0};var Vv=e=>({props:{tag:{type:String,default:"div"}},emits:["show"],render(){return t.h(this.tag,this.show&&this.$slots.default?this.$slots.default():null)},data:()=>({el:null,state:{loaded:!1},show:!1}),mounted(){this.el=this.$el,e.addLazyBox(this),e.lazyLoadHandler()},beforeUnmount(){e.removeComponent(this)},methods:{checkInView(){const t=P(this.$el);return C&&t.top<window.innerHeight*e.options.preLoad&&t.bottom>0&&t.left<window.innerWidth*e.options.preLoad&&t.right>0},load(){this.show=!0,this.state.loaded=!0,this.$emit("show",this)},destroy(){return this.$destroy}}});const Nv={selector:"img"};class Cv{constructor({el:e,binding:t,vnode:o,lazy:a}){this.el=null,this.vnode=o,this.binding=t,this.options={},this.lazy=a,this.queue=[],this.update({el:e,binding:t})}update({el:e,binding:t}){this.el=e,this.options=Object.assign({},Nv,t.value);this.getImgs().forEach(e=>{this.lazy.add(e,Object.assign({},this.binding,{value:{src:"dataset"in e?e.dataset.src:e.getAttribute("data-src"),error:("dataset"in e?e.dataset.error:e.getAttribute("data-error"))||this.options.error,loading:("dataset"in e?e.dataset.loading:e.getAttribute("data-loading"))||this.options.loading}}),this.vnode)})}getImgs(){return Array.from(this.el.querySelectorAll(this.options.selector))}clear(){this.getImgs().forEach(e=>this.lazy.remove(e)),this.vnode=null,this.binding=null,this.lazy=null}}class kv{constructor({lazy:e}){this.lazy=e,this.queue=[]}bind(e,t,o){const a=new Cv({el:e,binding:t,vnode:o,lazy:this.lazy});this.queue.push(a)}update(e,t,o){const a=this.queue.find(t=>t.el===e);a&&a.update({el:e,binding:t,vnode:o})}unbind(e){const t=this.queue.find(t=>t.el===e);t&&(t.clear(),br(this.queue,t))}}var Sv=e=>({props:{src:[String,Object],tag:{type:String,default:"img"}},render(){var e,o;return t.h(this.tag,{src:this.renderSrc},null==(o=(e=this.$slots).default)?void 0:o.call(e))},data:()=>({el:null,options:{src:"",error:"",loading:"",attempt:e.options.attempt},state:{loaded:!1,error:!1,attempt:0},renderSrc:""}),watch:{src(){this.init(),e.addLazyBox(this),e.lazyLoadHandler()}},created(){this.init()},mounted(){this.el=this.$el,e.addLazyBox(this),e.lazyLoadHandler()},beforeUnmount(){e.removeComponent(this)},methods:{init(){const{src:t,loading:o,error:a}=e.valueFormatter(this.src);this.state.loaded=!1,this.options.src=t,this.options.error=a,this.options.loading=o,this.renderSrc=this.options.loading},checkInView(){const t=P(this.$el);return t.top<window.innerHeight*e.options.preLoad&&t.bottom>0&&t.left<window.innerWidth*e.options.preLoad&&t.right>0},load(e=o){if(this.state.attempt>this.options.attempt-1&&this.state.error)return void e();const{src:t}=this.options;kr({src:t},({src:e})=>{this.renderSrc=e,this.state.loaded=!0},()=>{this.state.attempt++,this.renderSrc=this.options.error,this.state.error=!0})}}});const Tv={install(e,o={}){const a=class{constructor({preLoad:e,error:t,throttleWait:o,preLoadTop:a,dispatchEvent:n,loading:r,attempt:l,silent:i=!0,scale:s,listenEvents:c,filter:d,adapter:u,observer:p,observerOptions:v}){this.mode=hr,this.listeners=[],this.targetIndex=0,this.targets=[],this.options={silent:i,dispatchEvent:!!n,throttleWait:o||200,preLoad:e||1.3,preLoadTop:a||0,error:t||yv,loading:r||yv,attempt:l||3,scale:s||wr(s),ListenEvents:c||wv,supportWebp:xr(),filter:d||{},adapter:u||{},observer:!!p,observerOptions:v||xv},this.initEvent(),this.imageCache=new Sr({max:200}),this.lazyLoadHandler=Vr(this.lazyLoadHandler.bind(this),this.options.throttleWait),this.setMode(this.options.observer?gr:hr)}config(e={}){Object.assign(this.options,e)}performance(){return this.listeners.map(e=>e.performance())}addLazyBox(e){this.listeners.push(e),C&&(this.addListenerTarget(window),this.observer&&this.observer.observe(e.el),e.$el&&e.$el.parentNode&&this.addListenerTarget(e.$el.parentNode))}add(e,o,a){if(this.listeners.some(t=>t.el===e))return this.update(e,o),t.nextTick(this.lazyLoadHandler);const n=this.valueFormatter(o.value);let{src:r}=n;t.nextTick(()=>{r=yr(e,this.options.scale)||r,this.observer&&this.observer.observe(e);const l=Object.keys(o.modifiers)[0];let i;l&&(i=a.context.$refs[l],i=i?i.$el||i:document.getElementById(l)),i||(i=q(e));const s=new bv({bindType:o.arg,$parent:i,el:e,src:r,loading:n.loading,error:n.error,cors:n.cors,elRenderer:this.elRenderer.bind(this),options:this.options,imageCache:this.imageCache});this.listeners.push(s),C&&(this.addListenerTarget(window),this.addListenerTarget(i)),this.lazyLoadHandler(),t.nextTick(()=>this.lazyLoadHandler())})}update(e,o,a){const n=this.valueFormatter(o.value);let{src:r}=n;r=yr(e,this.options.scale)||r;const l=this.listeners.find(t=>t.el===e);l?l.update({src:r,error:n.error,loading:n.loading}):this.add(e,o,a),this.observer&&(this.observer.unobserve(e),this.observer.observe(e)),this.lazyLoadHandler(),t.nextTick(()=>this.lazyLoadHandler())}remove(e){if(!e)return;this.observer&&this.observer.unobserve(e);const t=this.listeners.find(t=>t.el===e);t&&(this.removeListenerTarget(t.$parent),this.removeListenerTarget(window),br(this.listeners,t),t.$destroy())}removeComponent(e){e&&(br(this.listeners,e),this.observer&&this.observer.unobserve(e.el),e.$parent&&e.$el.parentNode&&this.removeListenerTarget(e.$el.parentNode),this.removeListenerTarget(window))}setMode(e){fr||e!==gr||(e=hr),this.mode=e,e===hr?(this.observer&&(this.listeners.forEach(e=>{this.observer.unobserve(e.el)}),this.observer=null),this.targets.forEach(e=>{this.initListen(e.el,!0)})):(this.targets.forEach(e=>{this.initListen(e.el,!1)}),this.initIntersectionObserver())}addListenerTarget(e){if(!e)return;let t=this.targets.find(t=>t.el===e);return t?t.childrenCount++:(t={el:e,id:++this.targetIndex,childrenCount:1,listened:!0},this.mode===hr&&this.initListen(t.el,!0),this.targets.push(t)),this.targetIndex}removeListenerTarget(e){this.targets.forEach((t,o)=>{t.el===e&&(t.childrenCount--,t.childrenCount||(this.initListen(t.el,!1),this.targets.splice(o,1),t=null))})}initListen(e,t){this.options.ListenEvents.forEach(o=>(t?Nr:Cr)(e,o,this.lazyLoadHandler))}initEvent(){this.Event={listeners:{loading:[],loaded:[],error:[]}},this.$on=(e,t)=>{this.Event.listeners[e]||(this.Event.listeners[e]=[]),this.Event.listeners[e].push(t)},this.$once=(e,t)=>{const o=(...a)=>{this.$off(e,o),t.apply(this,a)};this.$on(e,o)},this.$off=(e,t)=>{if(t)br(this.Event.listeners[e],t);else{if(!this.Event.listeners[e])return;this.Event.listeners[e].length=0}},this.$emit=(e,t,o)=>{this.Event.listeners[e]&&this.Event.listeners[e].forEach(e=>e(t,o))}}lazyLoadHandler(){const e=[];this.listeners.forEach(t=>{t.el&&t.el.parentNode||e.push(t),t.checkInView()&&t.load()}),e.forEach(e=>{br(this.listeners,e),e.$destroy()})}initIntersectionObserver(){fr&&(this.observer=new IntersectionObserver(this.observerHandler.bind(this),this.options.observerOptions),this.listeners.length&&this.listeners.forEach(e=>{this.observer.observe(e.el)}))}observerHandler(e){e.forEach(e=>{e.isIntersecting&&this.listeners.forEach(t=>{if(t.el===e.target){if(t.state.loaded)return this.observer.unobserve(t.el);t.load()}})})}elRenderer(e,t,o){if(!e.el)return;const{el:a,bindType:n}=e;let r;switch(t){case"loading":r=e.loading;break;case"error":r=e.error;break;default:({src:r}=e)}if(n?a.style[n]='url("'+r+'")':a.getAttribute("src")!==r&&a.setAttribute("src",r),a.setAttribute("lazy",t),this.$emit(t,e,o),this.options.adapter[t]&&this.options.adapter[t](e,this.options),this.options.dispatchEvent){const o=new CustomEvent(t,{detail:e});a.dispatchEvent(o)}}valueFormatter(e){let t=e,{loading:o,error:a}=this.options;return r(e)&&(({src:t}=e),o=e.loading||this.options.loading,a=e.error||this.options.error),{src:t,loading:o,error:a}}},n=new a(o),l=new kv({lazy:n});e.config.globalProperties.$Lazyload=n,o.lazyComponent&&e.component("LazyComponent",Vv(n)),o.lazyImage&&e.component("LazyImage",Sv(n)),e.directive("lazy",{beforeMount:n.add.bind(n),updated:n.update.bind(n),unmounted:n.remove.bind(n)}),e.directive("lazy-container",{beforeMount:l.bind.bind(l),updated:l.update.bind(l),unmounted:l.unbind.bind(l)})}},Bv="4.9.21";function Pv(e){[tt,Et,Ft,lo,$n,mr,za,Dr,ct,zr,Ot,ul,yl,Cl,Fa,Bl,lr,Xn,zl,Wl,Gl,Ql,ei,ri,ui,hi,wi,Si,Ai,Hi,Yi,os,ls,fs,hs,$i,en,ws,Cs,Wa,Ps,Is,Ls,wt,fl,Ks,rc,lc,uc,Tt,Be,fc,yc,Pc,Mc,_t,Uc,Gc,Da,Zc,Md,to,jd,Gd,or,Hn,Jd,lu,iu,pu,yu,Cu,Bu,Iu,Qu,ju,ap,Gu,Lu,ip,pp,wp,kp,Sp,Wo,Op,Go,Ep,ua,Sn,fa,Rp,Up,ha,Kn,Gp,Qp,Vn,av,vv,gv].forEach(t=>{t.install?e.use(t):t.name&&e.component(t.name,t)})}var Dv={install:Pv,version:Bv};e.ActionBar=tt,e.ActionBarButton=Et,e.ActionBarIcon=Ft,e.ActionSheet=lo,e.AddressEdit=$n,e.AddressList=mr,e.Area=za,e.BackTop=Dr,e.Badge=ct,e.Barrage=zr,e.Button=Ot,e.Calendar=ul,e.Card=yl,e.Cascader=Cl,e.Cell=Fa,e.CellGroup=Bl,e.Checkbox=lr,e.CheckboxGroup=Xn,e.Circle=zl,e.Col=Wl,e.Collapse=Gl,e.CollapseItem=Ql,e.ConfigProvider=ei,e.ContactCard=ri,e.ContactEdit=ui,e.ContactList=hi,e.CountDown=wi,e.Coupon=Si,e.CouponCell=Ai,e.CouponList=Hi,e.DEFAULT_ROW_WIDTH=Uu,e.DatePicker=Yi,e.Dialog=os,e.Divider=ls,e.DropdownItem=fs,e.DropdownMenu=hs,e.Empty=$i,e.Field=en,e.FloatingBubble=ws,e.FloatingPanel=Cs,e.Form=Wa,e.Grid=Ps,e.GridItem=Is,e.Highlight=Ls,e.Icon=wt,e.Image=fl,e.ImagePreview=Ks,e.IndexAnchor=rc,e.IndexBar=lc,e.Lazyload=Tv,e.List=uc,e.Loading=Tt,e.Locale=Be,e.NavBar=fc,e.NoticeBar=yc,e.Notify=Pc,e.NumberKeyboard=Mc,e.Overlay=_t,e.Pagination=Uc,e.PasswordInput=Gc,e.Picker=Da,e.PickerGroup=Zc,e.Popover=Md,e.Popup=to,e.Progress=jd,e.PullRefresh=Gd,e.Radio=or,e.RadioGroup=Hn,e.Rate=Jd,e.RollingText=lu,e.Row=iu,e.Search=pu,e.ShareSheet=yu,e.Sidebar=Cu,e.SidebarItem=Bu,e.Signature=Iu,e.Skeleton=Qu,e.SkeletonAvatar=ju,e.SkeletonImage=ap,e.SkeletonParagraph=Gu,e.SkeletonTitle=Lu,e.Slider=ip,e.Space=pp,e.Step=wp,e.Stepper=kp,e.Steps=Sp,e.Sticky=Wo,e.SubmitBar=Op,e.Swipe=Go,e.SwipeCell=Ep,e.SwipeItem=ua,e.Switch=Sn,e.Tab=fa,e.Tabbar=Rp,e.TabbarItem=Up,e.Tabs=ha,e.Tag=Kn,e.TextEllipsis=Gp,e.TimePicker=Qp,e.Toast=Vn,e.TreeSelect=av,e.Uploader=vv,e.Watermark=gv,e.actionBarButtonProps=zt,e.actionBarIconProps=Mt,e.actionBarProps=et,e.actionSheetProps=no,e.addressEditProps=En,e.addressListProps=vr,e.allowMultipleToast=(e=!0)=>{pn=e},e.areaProps=Ia,e.backTopProps=Pr,e.badgeProps=st,e.barrageProps=Or,e.buttonProps=Dt,e.calendarProps=dl,e.cardProps=bl,e.cascaderProps=Nl,e.cellGroupProps=Tl,e.cellProps=Ma,e.checkboxGroupProps=Un,e.checkboxProps=rr,e.circleProps=Il,e.closeDialog=()=>{Ji&&Ji.toggle(!1)},e.closeNotify=Bc,e.closeToast=e=>{var t;un.length&&(e?(un.forEach(e=>{e.close()}),un=[]):pn?null==(t=un.shift())||t.close():un[0].close())},e.colProps=jl,e.collapseItemProps=Jl,e.collapseProps=ql,e.configProviderProps=mt,e.contactCardProps=ni,e.contactEditProps=di,e.contactListProps=fi,e.countDownProps=yi,e.couponCellProps=Di,e.couponListProps=Ri,e.datePickerProps=Ui,e.default=Dv,e.dialogProps=Zi,e.dividerProps=rs,e.dropdownItemProps=ms,e.dropdownMenuProps=cs,e.emptyProps=Ei,e.fieldProps=Qa,e.floatingBubbleProps=gs,e.floatingPanelProps=xs,e.formProps=ja,e.gridItemProps=As,e.gridProps=Ts,e.highlightProps=$s,e.iconProps=yt,e.imagePreviewProps=Ys,e.imageProps=ml,e.indexAnchorProps=nc,e.indexBarProps=Qs,e.install=Pv,e.listProps=dc,e.loadingProps=St,e.navBarProps=mc,e.noticeBarProps=bc,e.notifyProps=Nc,e.numberKeyboardProps=Lc,e.overlayProps=Kt,e.paginationProps=Wc,e.passwordInputProps=qc,e.pickerGroupProps=wa,e.pickerProps=Na,e.popoverProps=Ld,e.popupProps=Jt,e.progressProps=Hd,e.pullRefreshProps=qd,e.radioGroupProps=Fn,e.radioProps=Qn,e.rateProps=_d,e.resetDialogDefaultOptions=()=>{es=a({},Qi)},e.resetNotifyDefaultOptions=()=>{Tc={type:"danger",color:void 0,message:"",onClose:void 0,onClick:void 0,onOpened:void 0,duration:3e3,position:void 0,className:"",lockScroll:!1,background:void 0}},e.resetToastDefaultOptions=e=>{"string"==typeof e?mn.delete(e):(vn=a({},dn),mn.clear())},e.rollingTextProps=ru,e.rowProps=Ml,e.searchProps=uu,e.setDialogDefaultOptions=e=>{a(es,e)},e.setNotifyDefaultOptions=e=>a(Tc,e),e.setToastDefaultOptions=function(e,t){"string"==typeof e?mn.set(e,t):a(vn,e)},e.shareSheetProps=bu,e.showConfirmDialog=e=>ts(a({showCancelButton:!0},e)),e.showDialog=ts,e.showFailToast=xn,e.showImagePreview=Zs,e.showLoadingToast=yn,e.showNotify=function(e){var o;if(n)return Sc||({instance:Sc}=cn({setup(){const{state:e,toggle:o}=sn();return()=>t.createVNode(Cc,t.mergeProps(e,{"onUpdate:show":o}),null)}})),e=a({},Tc,r(o=e)?o:{message:o}),Sc.open(e),clearTimeout(kc),e.duration>0&&(kc=setTimeout(Bc,e.duration)),Sc},e.showSuccessToast=wn,e.showToast=gn,e.sidebarItemProps=Tu,e.sidebarProps=Nu,e.skeletonAvatarProps=Hu,e.skeletonImageProps=op,e.skeletonParagraphProps=Yu,e.skeletonProps=Ju,e.skeletonTitleProps=$u,e.sliderProps=lp,e.spaceProps=dp,e.stepperProps=Cp,e.stepsProps=fp,e.stickyProps=jo,e.submitBarProps=Dp,e.swipeCellProps=zp,e.swipeProps=Xo,e.switchProps=kn,e.tabProps=ma,e.tabbarItemProps=Wp,e.tabbarProps=Mp,e.tabsProps=ea,e.tagProps=Zn,e.textEllipsisProps=qp,e.timePickerProps=Jp,e.toastProps=rn,e.treeSelectProps=ov,e.uploaderProps=pv,e.useAllTabStatus=ra,e.useCurrentLang=()=>Se,e.useTabStatus=()=>t.inject(aa,null),e.version=Bv,e.watermarkProps=hv,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("vue"),require("vant"),require("vue-router")):"function"==typeof define&&define.amd?define(["vue","vant","vue-router"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Vue,e.vant,e.VueRouter)}(this,function(e,t,n){var r=Object.create,a=Object.defineProperty,o=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,s=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty,u=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),c=(e,t,n)=>(n=null!=e?r(s(e)):{},((e,t,n,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(var s,u=i(t),c=0,d=u.length;c<d;c++)s=u[c],l.call(e,s)||s===n||a(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=o(t,s))||r.enumerable});return e})(!t&&e&&e.__esModule?n:a(n,"default",{value:e,enumerable:!0}),e));t=c(t);var d=u((e,t)=>{var n,r;n=e,r=function(){"use strict";var e=6e4,t=36e5,n="millisecond",r="second",a="minute",o="hour",i="day",s="week",l="month",u="quarter",c="year",d="date",h="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],n=e%100;return"["+e+(t[(n-20)%10]||t[n]||t[0])+"]"}},g=function(e,t,n){var r=String(e);return!r||r.length>=t?e:""+Array(t+1-r.length).join(n)+e},b={s:g,z:function(e){var t=-e.utcOffset(),n=Math.abs(t),r=Math.floor(n/60),a=n%60;return(t<=0?"+":"-")+g(r,2,"0")+":"+g(a,2,"0")},m:function e(t,n){if(t.date()<n.date())return-e(n,t);var r=12*(n.year()-t.year())+(n.month()-t.month()),a=t.clone().add(r,l),o=n-a<0,i=t.clone().add(r+(o?-1:1),l);return+(-(r+(n-a)/(o?a-i:i-a))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:l,y:c,w:s,d:i,D:d,h:o,m:a,s:r,ms:n,Q:u}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},v="en",y={};y[v]=m;var _="$isDayjsObject",w=function(e){return e instanceof S||!(!e||!e[_])},k=function e(t,n,r){var a;if(!t)return v;if("string"==typeof t){var o=t.toLowerCase();y[o]&&(a=o),n&&(y[o]=n,a=o);var i=t.split("-");if(!a&&i.length>1)return e(i[0])}else{var s=t.name;y[s]=t,a=s}return!r&&a&&(v=a),a||!r&&v},x=function(e,t){if(w(e))return e.clone();var n="object"==typeof t?t:{};return n.date=e,n.args=arguments,new S(n)},$=b;$.l=k,$.i=w,$.w=function(e,t){return x(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var S=function(){function m(e){this.$L=k(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[_]=!0}var g=m.prototype;return g.parse=function(e){this.$d=function(e){var t=e.date,n=e.utc;if(null===t)return new Date(NaN);if($.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var r=t.match(f);if(r){var a=r[2]-1||0,o=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,o)):new Date(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,o)}}return new Date(t)}(e),this.init()},g.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},g.$utils=function(){return $},g.isValid=function(){return!(this.$d.toString()===h)},g.isSame=function(e,t){var n=x(e);return this.startOf(t)<=n&&n<=this.endOf(t)},g.isAfter=function(e,t){return x(e)<this.startOf(t)},g.isBefore=function(e,t){return this.endOf(t)<x(e)},g.$g=function(e,t,n){return $.u(e)?this[t]:this.set(n,e)},g.unix=function(){return Math.floor(this.valueOf()/1e3)},g.valueOf=function(){return this.$d.getTime()},g.startOf=function(e,t){var n=this,u=!!$.u(t)||t,h=$.p(e),f=function(e,t){var r=$.w(n.$u?Date.UTC(n.$y,t,e):new Date(n.$y,t,e),n);return u?r:r.endOf(i)},p=function(e,t){return $.w(n.toDate()[e].apply(n.toDate("s"),(u?[0,0,0,0]:[23,59,59,999]).slice(t)),n)},m=this.$W,g=this.$M,b=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return u?f(1,0):f(31,11);case l:return u?f(1,g):f(0,g+1);case s:var y=this.$locale().weekStart||0,_=(m<y?m+7:m)-y;return f(u?b-_:b+(6-_),g);case i:case d:return p(v+"Hours",0);case o:return p(v+"Minutes",1);case a:return p(v+"Seconds",2);case r:return p(v+"Milliseconds",3);default:return this.clone()}},g.endOf=function(e){return this.startOf(e,!1)},g.$set=function(e,t){var s,u=$.p(e),h="set"+(this.$u?"UTC":""),f=(s={},s[i]=h+"Date",s[d]=h+"Date",s[l]=h+"Month",s[c]=h+"FullYear",s[o]=h+"Hours",s[a]=h+"Minutes",s[r]=h+"Seconds",s[n]=h+"Milliseconds",s)[u],p=u===i?this.$D+(t-this.$W):t;if(u===l||u===c){var m=this.clone().set(d,1);m.$d[f](p),m.init(),this.$d=m.set(d,Math.min(this.$D,m.daysInMonth())).$d}else f&&this.$d[f](p);return this.init(),this},g.set=function(e,t){return this.clone().$set(e,t)},g.get=function(e){return this[$.p(e)]()},g.add=function(n,u){var d,h=this;n=Number(n);var f=$.p(u),p=function(e){var t=x(h);return $.w(t.date(t.date()+Math.round(e*n)),h)};if(f===l)return this.set(l,this.$M+n);if(f===c)return this.set(c,this.$y+n);if(f===i)return p(1);if(f===s)return p(7);var m=(d={},d[a]=e,d[o]=t,d[r]=1e3,d)[f]||1,g=this.$d.getTime()+n*m;return $.w(g,this)},g.subtract=function(e,t){return this.add(-1*e,t)},g.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return n.invalidDate||h;var r=e||"YYYY-MM-DDTHH:mm:ssZ",a=$.z(this),o=this.$H,i=this.$m,s=this.$M,l=n.weekdays,u=n.months,c=n.meridiem,d=function(e,n,a,o){return e&&(e[n]||e(t,r))||a[n].slice(0,o)},f=function(e){return $.s(o%12||12,e,"0")},m=c||function(e,t,n){var r=e<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(p,function(e,r){return r||function(e){switch(e){case"YY":return String(t.$y).slice(-2);case"YYYY":return $.s(t.$y,4,"0");case"M":return s+1;case"MM":return $.s(s+1,2,"0");case"MMM":return d(n.monthsShort,s,u,3);case"MMMM":return d(u,s);case"D":return t.$D;case"DD":return $.s(t.$D,2,"0");case"d":return String(t.$W);case"dd":return d(n.weekdaysMin,t.$W,l,2);case"ddd":return d(n.weekdaysShort,t.$W,l,3);case"dddd":return l[t.$W];case"H":return String(o);case"HH":return $.s(o,2,"0");case"h":return f(1);case"hh":return f(2);case"a":return m(o,i,!0);case"A":return m(o,i,!1);case"m":return String(i);case"mm":return $.s(i,2,"0");case"s":return String(t.$s);case"ss":return $.s(t.$s,2,"0");case"SSS":return $.s(t.$ms,3,"0");case"Z":return a}return null}(e)||a.replace(":","")})},g.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},g.diff=function(n,d,h){var f,p=this,m=$.p(d),g=x(n),b=(g.utcOffset()-this.utcOffset())*e,v=this-g,y=function(){return $.m(p,g)};switch(m){case c:f=y()/12;break;case l:f=y();break;case u:f=y()/3;break;case s:f=(v-b)/6048e5;break;case i:f=(v-b)/864e5;break;case o:f=v/t;break;case a:f=v/e;break;case r:f=v/1e3;break;default:f=v}return h?f:$.a(f)},g.daysInMonth=function(){return this.endOf(l).$D},g.$locale=function(){return y[this.$L]},g.locale=function(e,t){if(!e)return this.$L;var n=this.clone(),r=k(e,t,!0);return r&&(n.$L=r),n},g.clone=function(){return $.w(this.$d,this)},g.toDate=function(){return new Date(this.valueOf())},g.toJSON=function(){return this.isValid()?this.toISOString():null},g.toISOString=function(){return this.$d.toISOString()},g.toString=function(){return this.$d.toUTCString()},m}(),C=S.prototype;return x.prototype=C,[["$ms",n],["$s",r],["$m",a],["$H",o],["$W",i],["$M",l],["$y",c],["$D",d]].forEach(function(e){C[e[1]]=function(t){return this.$g(t,e[0],e[1])}}),x.extend=function(e,t){return e.$i||(e(t,S,x),e.$i=!0),x},x.locale=k,x.isDayjs=w,x.unix=function(e){return x(1e3*e)},x.en=y[v],x.Ls=y,x.p={},x},"object"==typeof e&&void 0!==t?t.exports=r():"function"==typeof define&&define.amd?define(r):(n="undefined"!=typeof globalThis?globalThis:n||self).dayjs=r()}),h=c(d());function f(e,t,n,r,a,o,i){try{var s=e[o](i),l=s.value}catch(u){return void n(u)}s.done?t(l):Promise.resolve(l).then(r,a)}function p(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var o=e.apply(t,n);function i(e){f(o,r,a,i,s,"next",e)}function s(e){f(o,r,a,i,s,"throw",e)}i(void 0)})}}var m=(0,e.reactive)({}),g={id:null,queue:[]};function b(e,t){return e?t?m[e]=t:(m[e]||(m[e]={id:e,nick:null,avatar:null},g.queue.push(e)),null===g.id&&g.queue.length>0&&(g.id=setTimeout(p(function*(){(yield $.get({data:{list:g.queue},url:"/api/zen/nick"})).forEach(e=>{m[e.id].nick=e.nick,m[e.id].avatar=e.avatar}),clearTimeout(g.id),g.queue=[],g.id=null}),60)),m[e]):{}}var v={},y={emit(){let e,t=Array.prototype.slice.apply(arguments),n=t.shift(),r=v[n],a=0;if(r&&!(r.length<1))for(;a<r.length;a++)e=r[a],e.func.apply(e.context,t),e.once&&r.splice(a,1)},on(e,t,n,r){t&&(v[e]=v[e]||[],v[e].push({func:t,context:n,once:r}))},subscribe(e,t,n){t&&(v[e]=[{func:t,context:n,once:!1}])},once(e,t,n){return this.on(e,t,n,!0)},off(e,t){if("*"===e)return v={};let n=v[e];if(n&&!(n.length<1)){if(!t)return delete v[e];for(let e=0;e<n.length;e++)if(n[e].func===t)return n.splice(e,1)}}};function _(e){let t=e.length;for(;--t>=0;)e[t]=0}var w=256,k=286,x=30,S=15,C=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),V=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),z=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),N=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),A=new Array(576);_(A);var O=new Array(60);_(O);var E=new Array(512);_(E);var D=new Array(256);_(D);var j=new Array(29);_(j);var B,T,R,L=new Array(x);function M(e,t,n,r,a){this.static_tree=e,this.extra_bits=t,this.extra_base=n,this.elems=r,this.max_length=a,this.has_stree=e&&e.length}function I(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}_(L);var U=e=>e<256?E[e]:E[256+(e>>>7)],P=(e,t)=>{e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255},F=(e,t,n)=>{e.bi_valid>16-n?(e.bi_buf|=t<<e.bi_valid&65535,P(e,e.bi_buf),e.bi_buf=t>>16-e.bi_valid,e.bi_valid+=n-16):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)},Z=(e,t,n)=>{F(e,n[2*t],n[2*t+1])},H=(e,t)=>{let n=0;do{n|=1&e,e>>>=1,n<<=1}while(--t>0);return n>>>1},q=(e,t,n)=>{const r=new Array(16);let a,o,i=0;for(a=1;a<=S;a++)i=i+n[a-1]<<1,r[a]=i;for(o=0;o<=t;o++){let t=e[2*o+1];0!==t&&(e[2*o]=H(r[t]++,t))}},Y=e=>{let t;for(t=0;t<k;t++)e.dyn_ltree[2*t]=0;for(t=0;t<x;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.sym_next=e.matches=0},J=e=>{e.bi_valid>8?P(e,e.bi_buf):e.bi_valid>0&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0},W=(e,t,n,r)=>{const a=2*t,o=2*n;return e[a]<e[o]||e[a]===e[o]&&r[t]<=r[n]},K=(e,t,n)=>{const r=e.heap[n];let a=n<<1;for(;a<=e.heap_len&&(a<e.heap_len&&W(t,e.heap[a+1],e.heap[a],e.depth)&&a++,!W(t,r,e.heap[a],e.depth));)e.heap[n]=e.heap[a],n=a,a<<=1;e.heap[n]=r},X=(e,t,n)=>{let r,a,o,i,s=0;if(0!==e.sym_next)do{r=255&e.pending_buf[e.sym_buf+s++],r+=(255&e.pending_buf[e.sym_buf+s++])<<8,a=e.pending_buf[e.sym_buf+s++],0===r?Z(e,a,t):(o=D[a],Z(e,o+w+1,t),i=C[o],0!==i&&(a-=j[o],F(e,a,i)),r--,o=U(r),Z(e,o,n),i=V[o],0!==i&&(r-=L[o],F(e,r,i)))}while(s<e.sym_next);Z(e,256,t)},G=(e,t)=>{const n=t.dyn_tree,r=t.stat_desc.static_tree,a=t.stat_desc.has_stree,o=t.stat_desc.elems;let i,s,l,u=-1;for(e.heap_len=0,e.heap_max=573,i=0;i<o;i++)0!==n[2*i]?(e.heap[++e.heap_len]=u=i,e.depth[i]=0):n[2*i+1]=0;for(;e.heap_len<2;)l=e.heap[++e.heap_len]=u<2?++u:0,n[2*l]=1,e.depth[l]=0,e.opt_len--,a&&(e.static_len-=r[2*l+1]);for(t.max_code=u,i=e.heap_len>>1;i>=1;i--)K(e,n,i);l=o;do{i=e.heap[1],e.heap[1]=e.heap[e.heap_len--],K(e,n,1),s=e.heap[1],e.heap[--e.heap_max]=i,e.heap[--e.heap_max]=s,n[2*l]=n[2*i]+n[2*s],e.depth[l]=(e.depth[i]>=e.depth[s]?e.depth[i]:e.depth[s])+1,n[2*i+1]=n[2*s+1]=l,e.heap[1]=l++,K(e,n,1)}while(e.heap_len>=2);e.heap[--e.heap_max]=e.heap[1],((e,t)=>{const n=t.dyn_tree,r=t.max_code,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,i=t.stat_desc.extra_bits,s=t.stat_desc.extra_base,l=t.stat_desc.max_length;let u,c,d,h,f,p,m=0;for(h=0;h<=S;h++)e.bl_count[h]=0;for(n[2*e.heap[e.heap_max]+1]=0,u=e.heap_max+1;u<573;u++)c=e.heap[u],h=n[2*n[2*c+1]+1]+1,h>l&&(h=l,m++),n[2*c+1]=h,c>r||(e.bl_count[h]++,f=0,c>=s&&(f=i[c-s]),p=n[2*c],e.opt_len+=p*(h+f),o&&(e.static_len+=p*(a[2*c+1]+f)));if(0!==m){do{for(h=l-1;0===e.bl_count[h];)h--;e.bl_count[h]--,e.bl_count[h+1]+=2,e.bl_count[l]--,m-=2}while(m>0);for(h=l;0!==h;h--)for(c=e.bl_count[h];0!==c;)d=e.heap[--u],d>r||(n[2*d+1]!==h&&(e.opt_len+=(h-n[2*d+1])*n[2*d],n[2*d+1]=h),c--)}})(e,t),q(n,u,e.bl_count)},Q=(e,t,n)=>{let r,a,o=-1,i=t[1],s=0,l=7,u=4;for(0===i&&(l=138,u=3),t[2*(n+1)+1]=65535,r=0;r<=n;r++)a=i,i=t[2*(r+1)+1],++s<l&&a===i||(s<u?e.bl_tree[2*a]+=s:0!==a?(a!==o&&e.bl_tree[2*a]++,e.bl_tree[32]++):s<=10?e.bl_tree[34]++:e.bl_tree[36]++,s=0,o=a,0===i?(l=138,u=3):a===i?(l=6,u=3):(l=7,u=4))},ee=(e,t,n)=>{let r,a,o=-1,i=t[1],s=0,l=7,u=4;for(0===i&&(l=138,u=3),r=0;r<=n;r++)if(a=i,i=t[2*(r+1)+1],!(++s<l&&a===i)){if(s<u)do{Z(e,a,e.bl_tree)}while(0!==--s);else 0!==a?(a!==o&&(Z(e,a,e.bl_tree),s--),Z(e,16,e.bl_tree),F(e,s-3,2)):s<=10?(Z(e,17,e.bl_tree),F(e,s-3,3)):(Z(e,18,e.bl_tree),F(e,s-11,7));s=0,o=a,0===i?(l=138,u=3):a===i?(l=6,u=3):(l=7,u=4)}},te=!1,ne=(e,t,n,r)=>{F(e,0+(r?1:0),3),J(e),P(e,n),P(e,~n),n&&e.pending_buf.set(e.window.subarray(t,t+n),e.pending),e.pending+=n},re={_tr_init:e=>{te||((()=>{let e,t,n,r,a;const o=new Array(16);for(n=0,r=0;r<28;r++)for(j[r]=n,e=0;e<1<<C[r];e++)D[n++]=r;for(D[n-1]=r,a=0,r=0;r<16;r++)for(L[r]=a,e=0;e<1<<V[r];e++)E[a++]=r;for(a>>=7;r<x;r++)for(L[r]=a<<7,e=0;e<1<<V[r]-7;e++)E[256+a++]=r;for(t=0;t<=S;t++)o[t]=0;for(e=0;e<=143;)A[2*e+1]=8,e++,o[8]++;for(;e<=255;)A[2*e+1]=9,e++,o[9]++;for(;e<=279;)A[2*e+1]=7,e++,o[7]++;for(;e<=287;)A[2*e+1]=8,e++,o[8]++;for(q(A,287,o),e=0;e<x;e++)O[2*e+1]=5,O[2*e]=H(e,5);B=new M(A,C,257,k,S),T=new M(O,V,0,x,S),R=new M(new Array(0),z,0,19,7)})(),te=!0),e.l_desc=new I(e.dyn_ltree,B),e.d_desc=new I(e.dyn_dtree,T),e.bl_desc=new I(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,Y(e)},_tr_stored_block:ne,_tr_flush_block:(e,t,n,r)=>{let a,o,i=0;e.level>0?(2===e.strm.data_type&&(e.strm.data_type=(e=>{let t,n=4093624447;for(t=0;t<=31;t++,n>>>=1)if(1&n&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<w;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0})(e)),G(e,e.l_desc),G(e,e.d_desc),i=(e=>{let t;for(Q(e,e.dyn_ltree,e.l_desc.max_code),Q(e,e.dyn_dtree,e.d_desc.max_code),G(e,e.bl_desc),t=18;t>=3&&0===e.bl_tree[2*N[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t})(e),a=e.opt_len+3+7>>>3,o=e.static_len+3+7>>>3,o<=a&&(a=o)):a=o=n+5,n+4<=a&&-1!==t?ne(e,t,n,r):4===e.strategy||o===a?(F(e,2+(r?1:0),3),X(e,A,O)):(F(e,4+(r?1:0),3),((e,t,n,r)=>{let a;for(F(e,t-257,5),F(e,n-1,5),F(e,r-4,4),a=0;a<r;a++)F(e,e.bl_tree[2*N[a]+1],3);ee(e,e.dyn_ltree,t-1),ee(e,e.dyn_dtree,n-1)})(e,e.l_desc.max_code+1,e.d_desc.max_code+1,i+1),X(e,e.dyn_ltree,e.dyn_dtree)),Y(e),r&&J(e)},_tr_tally:(e,t,n)=>(e.pending_buf[e.sym_buf+e.sym_next++]=t,e.pending_buf[e.sym_buf+e.sym_next++]=t>>8,e.pending_buf[e.sym_buf+e.sym_next++]=n,0===t?e.dyn_ltree[2*n]++:(e.matches++,t--,e.dyn_ltree[2*(D[n]+w+1)]++,e.dyn_dtree[2*U(t)]++),e.sym_next===e.sym_end),_tr_align:e=>{F(e,2,3),Z(e,256,A),(e=>{16===e.bi_valid?(P(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):e.bi_valid>=8&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)})(e)}},ae=(e,t,n,r)=>{let a=65535&e,o=e>>>16&65535,i=0;for(;0!==n;){i=n>2e3?2e3:n,n-=i;do{a=a+t[r++]|0,o=o+a|0}while(--i);a%=65521,o%=65521}return a|o<<16},oe=new Uint32Array((()=>{let e,t=[];for(var n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t})()),ie=(e,t,n,r)=>{const a=oe,o=r+n;e^=-1;for(let i=r;i<o;i++)e=e>>>8^a[255&(e^t[i])];return-1^e},se={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},le={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8},{_tr_init:ue,_tr_stored_block:ce,_tr_flush_block:de,_tr_tally:he,_tr_align:fe}=re,{Z_NO_FLUSH:pe,Z_PARTIAL_FLUSH:me,Z_FULL_FLUSH:ge,Z_FINISH:be,Z_BLOCK:ve,Z_OK:ye,Z_STREAM_END:_e,Z_STREAM_ERROR:we,Z_DATA_ERROR:ke,Z_BUF_ERROR:xe,Z_DEFAULT_COMPRESSION:$e,Z_FILTERED:Se,Z_HUFFMAN_ONLY:Ce,Z_RLE:Ve,Z_FIXED:ze,Z_DEFAULT_STRATEGY:Ne,Z_UNKNOWN:Ae,Z_DEFLATED:Oe}=le,Ee=258,De=262,je=42,Be=113,Te=666,Re=(e,t)=>(e.msg=se[t],t),Le=e=>2*e-(e>4?9:0),Me=e=>{let t=e.length;for(;--t>=0;)e[t]=0},Ie=e=>{let t,n,r,a=e.w_size;t=e.hash_size,r=t;do{n=e.head[--r],e.head[r]=n>=a?n-a:0}while(--t);t=a,r=t;do{n=e.prev[--r],e.prev[r]=n>=a?n-a:0}while(--t)},Ue=(e,t,n)=>(t<<e.hash_shift^n)&e.hash_mask,Pe=e=>{const t=e.state;let n=t.pending;n>e.avail_out&&(n=e.avail_out),0!==n&&(e.output.set(t.pending_buf.subarray(t.pending_out,t.pending_out+n),e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,0===t.pending&&(t.pending_out=0))},Fe=(e,t)=>{de(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,Pe(e.strm)},Ze=(e,t)=>{e.pending_buf[e.pending++]=t},He=(e,t)=>{e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t},qe=(e,t,n,r)=>{let a=e.avail_in;return a>r&&(a=r),0===a?0:(e.avail_in-=a,t.set(e.input.subarray(e.next_in,e.next_in+a),n),1===e.state.wrap?e.adler=ae(e.adler,t,a,n):2===e.state.wrap&&(e.adler=ie(e.adler,t,a,n)),e.next_in+=a,e.total_in+=a,a)},Ye=(e,t)=>{let n,r,a=e.max_chain_length,o=e.strstart,i=e.prev_length,s=e.nice_match;const l=e.strstart>e.w_size-De?e.strstart-(e.w_size-De):0,u=e.window,c=e.w_mask,d=e.prev,h=e.strstart+Ee;let f=u[o+i-1],p=u[o+i];e.prev_length>=e.good_match&&(a>>=2),s>e.lookahead&&(s=e.lookahead);do{if(n=t,u[n+i]===p&&u[n+i-1]===f&&u[n]===u[o]&&u[++n]===u[o+1]){o+=2,n++;do{}while(u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&o<h);if(r=Ee-(h-o),o=h-Ee,r>i){if(e.match_start=t,i=r,r>=s)break;f=u[o+i-1],p=u[o+i]}}}while((t=d[t&c])>l&&0!==--a);return i<=e.lookahead?i:e.lookahead},Je=e=>{const t=e.w_size;let n,r,a;do{if(r=e.window_size-e.lookahead-e.strstart,e.strstart>=t+(t-De)&&(e.window.set(e.window.subarray(t,t+t-r),0),e.match_start-=t,e.strstart-=t,e.block_start-=t,e.insert>e.strstart&&(e.insert=e.strstart),Ie(e),r+=t),0===e.strm.avail_in)break;if(n=qe(e.strm,e.window,e.strstart+e.lookahead,r),e.lookahead+=n,e.lookahead+e.insert>=3)for(a=e.strstart-e.insert,e.ins_h=e.window[a],e.ins_h=Ue(e,e.ins_h,e.window[a+1]);e.insert&&(e.ins_h=Ue(e,e.ins_h,e.window[a+3-1]),e.prev[a&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=a,a++,e.insert--,!(e.lookahead+e.insert<3)););}while(e.lookahead<De&&0!==e.strm.avail_in)},We=(e,t)=>{let n,r,a,o=e.pending_buf_size-5>e.w_size?e.w_size:e.pending_buf_size-5,i=0,s=e.strm.avail_in;do{if(n=65535,a=e.bi_valid+42>>3,e.strm.avail_out<a)break;if(a=e.strm.avail_out-a,r=e.strstart-e.block_start,n>r+e.strm.avail_in&&(n=r+e.strm.avail_in),n>a&&(n=a),n<o&&(0===n&&t!==be||t===pe||n!==r+e.strm.avail_in))break;i=t===be&&n===r+e.strm.avail_in?1:0,ce(e,0,0,i),e.pending_buf[e.pending-4]=n,e.pending_buf[e.pending-3]=n>>8,e.pending_buf[e.pending-2]=~n,e.pending_buf[e.pending-1]=~n>>8,Pe(e.strm),r&&(r>n&&(r=n),e.strm.output.set(e.window.subarray(e.block_start,e.block_start+r),e.strm.next_out),e.strm.next_out+=r,e.strm.avail_out-=r,e.strm.total_out+=r,e.block_start+=r,n-=r),n&&(qe(e.strm,e.strm.output,e.strm.next_out,n),e.strm.next_out+=n,e.strm.avail_out-=n,e.strm.total_out+=n)}while(0===i);return s-=e.strm.avail_in,s&&(s>=e.w_size?(e.matches=2,e.window.set(e.strm.input.subarray(e.strm.next_in-e.w_size,e.strm.next_in),0),e.strstart=e.w_size,e.insert=e.strstart):(e.window_size-e.strstart<=s&&(e.strstart-=e.w_size,e.window.set(e.window.subarray(e.w_size,e.w_size+e.strstart),0),e.matches<2&&e.matches++,e.insert>e.strstart&&(e.insert=e.strstart)),e.window.set(e.strm.input.subarray(e.strm.next_in-s,e.strm.next_in),e.strstart),e.strstart+=s,e.insert+=s>e.w_size-e.insert?e.w_size-e.insert:s),e.block_start=e.strstart),e.high_water<e.strstart&&(e.high_water=e.strstart),i?4:t!==pe&&t!==be&&0===e.strm.avail_in&&e.strstart===e.block_start?2:(a=e.window_size-e.strstart,e.strm.avail_in>a&&e.block_start>=e.w_size&&(e.block_start-=e.w_size,e.strstart-=e.w_size,e.window.set(e.window.subarray(e.w_size,e.w_size+e.strstart),0),e.matches<2&&e.matches++,a+=e.w_size,e.insert>e.strstart&&(e.insert=e.strstart)),a>e.strm.avail_in&&(a=e.strm.avail_in),a&&(qe(e.strm,e.window,e.strstart,a),e.strstart+=a,e.insert+=a>e.w_size-e.insert?e.w_size-e.insert:a),e.high_water<e.strstart&&(e.high_water=e.strstart),a=e.bi_valid+42>>3,a=e.pending_buf_size-a>65535?65535:e.pending_buf_size-a,o=a>e.w_size?e.w_size:a,r=e.strstart-e.block_start,(r>=o||(r||t===be)&&t!==pe&&0===e.strm.avail_in&&r<=a)&&(n=r>a?a:r,i=t===be&&0===e.strm.avail_in&&n===r?1:0,ce(e,e.block_start,n,i),e.block_start+=n,Pe(e.strm)),i?3:1)},Ke=(e,t)=>{let n,r;for(;;){if(e.lookahead<De){if(Je(e),e.lookahead<De&&t===pe)return 1;if(0===e.lookahead)break}if(n=0,e.lookahead>=3&&(e.ins_h=Ue(e,e.ins_h,e.window[e.strstart+3-1]),n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==n&&e.strstart-n<=e.w_size-De&&(e.match_length=Ye(e,n)),e.match_length>=3)if(r=he(e,e.strstart-e.match_start,e.match_length-3),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=3){e.match_length--;do{e.strstart++,e.ins_h=Ue(e,e.ins_h,e.window[e.strstart+3-1]),n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart}while(0!==--e.match_length);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=Ue(e,e.ins_h,e.window[e.strstart+1]);else r=he(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(Fe(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<2?e.strstart:2,t===be?(Fe(e,!0),0===e.strm.avail_out?3:4):e.sym_next&&(Fe(e,!1),0===e.strm.avail_out)?1:2},Xe=(e,t)=>{let n,r,a;for(;;){if(e.lookahead<De){if(Je(e),e.lookahead<De&&t===pe)return 1;if(0===e.lookahead)break}if(n=0,e.lookahead>=3&&(e.ins_h=Ue(e,e.ins_h,e.window[e.strstart+3-1]),n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=2,0!==n&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-De&&(e.match_length=Ye(e,n),e.match_length<=5&&(e.strategy===Se||3===e.match_length&&e.strstart-e.match_start>4096)&&(e.match_length=2)),e.prev_length>=3&&e.match_length<=e.prev_length){a=e.strstart+e.lookahead-3,r=he(e,e.strstart-1-e.prev_match,e.prev_length-3),e.lookahead-=e.prev_length-1,e.prev_length-=2;do{++e.strstart<=a&&(e.ins_h=Ue(e,e.ins_h,e.window[e.strstart+3-1]),n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart)}while(0!==--e.prev_length);if(e.match_available=0,e.match_length=2,e.strstart++,r&&(Fe(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if(r=he(e,0,e.window[e.strstart-1]),r&&Fe(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(r=he(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<2?e.strstart:2,t===be?(Fe(e,!0),0===e.strm.avail_out?3:4):e.sym_next&&(Fe(e,!1),0===e.strm.avail_out)?1:2};function Ge(e,t,n,r,a){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=a}var Qe=[new Ge(0,0,0,0,We),new Ge(4,4,8,4,Ke),new Ge(4,5,16,8,Ke),new Ge(4,6,32,32,Ke),new Ge(4,4,16,16,Xe),new Ge(8,16,32,32,Xe),new Ge(8,16,128,128,Xe),new Ge(8,32,128,256,Xe),new Ge(32,128,258,1024,Xe),new Ge(32,258,258,4096,Xe)];function et(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Oe,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),Me(this.dyn_ltree),Me(this.dyn_dtree),Me(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),Me(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),Me(this.depth),this.sym_buf=0,this.lit_bufsize=0,this.sym_next=0,this.sym_end=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}var tt=e=>{if(!e)return 1;const t=e.state;return!t||t.strm!==e||t.status!==je&&57!==t.status&&69!==t.status&&73!==t.status&&91!==t.status&&103!==t.status&&t.status!==Be&&t.status!==Te?1:0},nt=e=>{if(tt(e))return Re(e,we);e.total_in=e.total_out=0,e.data_type=Ae;const t=e.state;return t.pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=2===t.wrap?57:t.wrap?je:Be,e.adler=2===t.wrap?0:1,t.last_flush=-2,ue(t),ye},rt=e=>{const t=nt(e);var n;return t===ye&&((n=e.state).window_size=2*n.w_size,Me(n.head),n.max_lazy_match=Qe[n.level].max_lazy,n.good_match=Qe[n.level].good_length,n.nice_match=Qe[n.level].nice_length,n.max_chain_length=Qe[n.level].max_chain,n.strstart=0,n.block_start=0,n.lookahead=0,n.insert=0,n.match_length=n.prev_length=2,n.match_available=0,n.ins_h=0),t},at=(e,t,n,r,a,o)=>{if(!e)return we;let i=1;if(t===$e&&(t=6),r<0?(i=0,r=-r):r>15&&(i=2,r-=16),a<1||a>9||n!==Oe||r<8||r>15||t<0||t>9||o<0||o>ze||8===r&&1!==i)return Re(e,we);8===r&&(r=9);const s=new et;return e.state=s,s.strm=e,s.status=je,s.wrap=i,s.gzhead=null,s.w_bits=r,s.w_size=1<<s.w_bits,s.w_mask=s.w_size-1,s.hash_bits=a+7,s.hash_size=1<<s.hash_bits,s.hash_mask=s.hash_size-1,s.hash_shift=~~((s.hash_bits+3-1)/3),s.window=new Uint8Array(2*s.w_size),s.head=new Uint16Array(s.hash_size),s.prev=new Uint16Array(s.w_size),s.lit_bufsize=1<<a+6,s.pending_buf_size=4*s.lit_bufsize,s.pending_buf=new Uint8Array(s.pending_buf_size),s.sym_buf=s.lit_bufsize,s.sym_end=3*(s.lit_bufsize-1),s.level=t,s.strategy=o,s.method=n,rt(e)},ot=at,it=(e,t)=>tt(e)||2!==e.state.wrap?we:(e.state.gzhead=t,ye),st=(e,t)=>{if(tt(e)||t>ve||t<0)return e?Re(e,we):we;const n=e.state;if(!e.output||0!==e.avail_in&&!e.input||n.status===Te&&t!==be)return Re(e,0===e.avail_out?xe:we);const r=n.last_flush;if(n.last_flush=t,0!==n.pending){if(Pe(e),0===e.avail_out)return n.last_flush=-1,ye}else if(0===e.avail_in&&Le(t)<=Le(r)&&t!==be)return Re(e,xe);if(n.status===Te&&0!==e.avail_in)return Re(e,xe);if(n.status===je&&0===n.wrap&&(n.status=Be),n.status===je){let t=Oe+(n.w_bits-8<<4)<<8,r=-1;if(r=n.strategy>=Ce||n.level<2?0:n.level<6?1:6===n.level?2:3,t|=r<<6,0!==n.strstart&&(t|=32),t+=31-t%31,He(n,t),0!==n.strstart&&(He(n,e.adler>>>16),He(n,65535&e.adler)),e.adler=1,n.status=Be,Pe(e),0!==n.pending)return n.last_flush=-1,ye}if(57===n.status)if(e.adler=0,Ze(n,31),Ze(n,139),Ze(n,8),n.gzhead)Ze(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),Ze(n,255&n.gzhead.time),Ze(n,n.gzhead.time>>8&255),Ze(n,n.gzhead.time>>16&255),Ze(n,n.gzhead.time>>24&255),Ze(n,9===n.level?2:n.strategy>=Ce||n.level<2?4:0),Ze(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(Ze(n,255&n.gzhead.extra.length),Ze(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=ie(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69;else if(Ze(n,0),Ze(n,0),Ze(n,0),Ze(n,0),Ze(n,0),Ze(n,9===n.level?2:n.strategy>=Ce||n.level<2?4:0),Ze(n,3),n.status=Be,Pe(e),0!==n.pending)return n.last_flush=-1,ye;if(69===n.status){if(n.gzhead.extra){let t=n.pending,r=(65535&n.gzhead.extra.length)-n.gzindex;for(;n.pending+r>n.pending_buf_size;){let a=n.pending_buf_size-n.pending;if(n.pending_buf.set(n.gzhead.extra.subarray(n.gzindex,n.gzindex+a),n.pending),n.pending=n.pending_buf_size,n.gzhead.hcrc&&n.pending>t&&(e.adler=ie(e.adler,n.pending_buf,n.pending-t,t)),n.gzindex+=a,Pe(e),0!==n.pending)return n.last_flush=-1,ye;t=0,r-=a}let a=new Uint8Array(n.gzhead.extra);n.pending_buf.set(a.subarray(n.gzindex,n.gzindex+r),n.pending),n.pending+=r,n.gzhead.hcrc&&n.pending>t&&(e.adler=ie(e.adler,n.pending_buf,n.pending-t,t)),n.gzindex=0}n.status=73}if(73===n.status){if(n.gzhead.name){let t,r=n.pending;do{if(n.pending===n.pending_buf_size){if(n.gzhead.hcrc&&n.pending>r&&(e.adler=ie(e.adler,n.pending_buf,n.pending-r,r)),Pe(e),0!==n.pending)return n.last_flush=-1,ye;r=0}t=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,Ze(n,t)}while(0!==t);n.gzhead.hcrc&&n.pending>r&&(e.adler=ie(e.adler,n.pending_buf,n.pending-r,r)),n.gzindex=0}n.status=91}if(91===n.status){if(n.gzhead.comment){let t,r=n.pending;do{if(n.pending===n.pending_buf_size){if(n.gzhead.hcrc&&n.pending>r&&(e.adler=ie(e.adler,n.pending_buf,n.pending-r,r)),Pe(e),0!==n.pending)return n.last_flush=-1,ye;r=0}t=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,Ze(n,t)}while(0!==t);n.gzhead.hcrc&&n.pending>r&&(e.adler=ie(e.adler,n.pending_buf,n.pending-r,r))}n.status=103}if(103===n.status){if(n.gzhead.hcrc){if(n.pending+2>n.pending_buf_size&&(Pe(e),0!==n.pending))return n.last_flush=-1,ye;Ze(n,255&e.adler),Ze(n,e.adler>>8&255),e.adler=0}if(n.status=Be,Pe(e),0!==n.pending)return n.last_flush=-1,ye}if(0!==e.avail_in||0!==n.lookahead||t!==pe&&n.status!==Te){let r=0===n.level?We(n,t):n.strategy===Ce?((e,t)=>{let n;for(;;){if(0===e.lookahead&&(Je(e),0===e.lookahead)){if(t===pe)return 1;break}if(e.match_length=0,n=he(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,n&&(Fe(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,t===be?(Fe(e,!0),0===e.strm.avail_out?3:4):e.sym_next&&(Fe(e,!1),0===e.strm.avail_out)?1:2})(n,t):n.strategy===Ve?((e,t)=>{let n,r,a,o;const i=e.window;for(;;){if(e.lookahead<=Ee){if(Je(e),e.lookahead<=Ee&&t===pe)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=3&&e.strstart>0&&(a=e.strstart-1,r=i[a],r===i[++a]&&r===i[++a]&&r===i[++a])){o=e.strstart+Ee;do{}while(r===i[++a]&&r===i[++a]&&r===i[++a]&&r===i[++a]&&r===i[++a]&&r===i[++a]&&r===i[++a]&&r===i[++a]&&a<o);e.match_length=Ee-(o-a),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=3?(n=he(e,1,e.match_length-3),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(n=he(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),n&&(Fe(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,t===be?(Fe(e,!0),0===e.strm.avail_out?3:4):e.sym_next&&(Fe(e,!1),0===e.strm.avail_out)?1:2})(n,t):Qe[n.level].func(n,t);if(3!==r&&4!==r||(n.status=Te),1===r||3===r)return 0===e.avail_out&&(n.last_flush=-1),ye;if(2===r&&(t===me?fe(n):t!==ve&&(ce(n,0,0,!1),t===ge&&(Me(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),Pe(e),0===e.avail_out))return n.last_flush=-1,ye}return t!==be?ye:n.wrap<=0?_e:(2===n.wrap?(Ze(n,255&e.adler),Ze(n,e.adler>>8&255),Ze(n,e.adler>>16&255),Ze(n,e.adler>>24&255),Ze(n,255&e.total_in),Ze(n,e.total_in>>8&255),Ze(n,e.total_in>>16&255),Ze(n,e.total_in>>24&255)):(He(n,e.adler>>>16),He(n,65535&e.adler)),Pe(e),n.wrap>0&&(n.wrap=-n.wrap),0!==n.pending?ye:_e)},lt=e=>{if(tt(e))return we;const t=e.state.status;return e.state=null,t===Be?Re(e,ke):ye},ut=(e,t)=>{let n=t.length;if(tt(e))return we;const r=e.state,a=r.wrap;if(2===a||1===a&&r.status!==je||r.lookahead)return we;if(1===a&&(e.adler=ae(e.adler,t,n,0)),r.wrap=0,n>=r.w_size){0===a&&(Me(r.head),r.strstart=0,r.block_start=0,r.insert=0);let e=new Uint8Array(r.w_size);e.set(t.subarray(n-r.w_size,n),0),t=e,n=r.w_size}const o=e.avail_in,i=e.next_in,s=e.input;for(e.avail_in=n,e.next_in=0,e.input=t,Je(r);r.lookahead>=3;){let e=r.strstart,t=r.lookahead-2;do{r.ins_h=Ue(r,r.ins_h,r.window[e+3-1]),r.prev[e&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=e,e++}while(--t);r.strstart=e,r.lookahead=2,Je(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=2,r.match_available=0,e.next_in=i,e.input=s,e.avail_in=o,r.wrap=a,ye},ct=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),dt=function(e){const t=Array.prototype.slice.call(arguments,1);for(;t.length;){const n=t.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(const t in n)ct(n,t)&&(e[t]=n[t])}}return e},ht=e=>{let t=0;for(let r=0,a=e.length;r<a;r++)t+=e[r].length;const n=new Uint8Array(t);for(let r=0,a=0,o=e.length;r<o;r++){let t=e[r];n.set(t,a),a+=t.length}return n},ft=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(Ti){ft=!1}var pt=new Uint8Array(256);for(let $=0;$<256;$++)pt[$]=$>=252?6:$>=248?5:$>=240?4:$>=224?3:$>=192?2:1;pt[254]=pt[254]=1;var mt=e=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(e);let t,n,r,a,o,i=e.length,s=0;for(a=0;a<i;a++)n=e.charCodeAt(a),55296==(64512&n)&&a+1<i&&(r=e.charCodeAt(a+1),56320==(64512&r)&&(n=65536+(n-55296<<10)+(r-56320),a++)),s+=n<128?1:n<2048?2:n<65536?3:4;for(t=new Uint8Array(s),o=0,a=0;o<s;a++)n=e.charCodeAt(a),55296==(64512&n)&&a+1<i&&(r=e.charCodeAt(a+1),56320==(64512&r)&&(n=65536+(n-55296<<10)+(r-56320),a++)),n<128?t[o++]=n:n<2048?(t[o++]=192|n>>>6,t[o++]=128|63&n):n<65536?(t[o++]=224|n>>>12,t[o++]=128|n>>>6&63,t[o++]=128|63&n):(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63,t[o++]=128|n>>>6&63,t[o++]=128|63&n);return t},gt=(e,t)=>{const n=t||e.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(e.subarray(0,t));let r,a;const o=new Array(2*n);for(a=0,r=0;r<n;){let t=e[r++];if(t<128){o[a++]=t;continue}let i=pt[t];if(i>4)o[a++]=65533,r+=i-1;else{for(t&=2===i?31:3===i?15:7;i>1&&r<n;)t=t<<6|63&e[r++],i--;i>1?o[a++]=65533:t<65536?o[a++]=t:(t-=65536,o[a++]=55296|t>>10&1023,o[a++]=56320|1023&t)}}return((e,t)=>{if(t<65534&&e.subarray&&ft)return String.fromCharCode.apply(null,e.length===t?e:e.subarray(0,t));let n="";for(let r=0;r<t;r++)n+=String.fromCharCode(e[r]);return n})(o,a)},bt=(e,t)=>{(t=t||e.length)>e.length&&(t=e.length);let n=t-1;for(;n>=0&&128==(192&e[n]);)n--;return n<0||0===n?t:n+pt[e[n]]>t?n:t};var vt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0},yt=Object.prototype.toString,{Z_NO_FLUSH:_t,Z_SYNC_FLUSH:wt,Z_FULL_FLUSH:kt,Z_FINISH:xt,Z_OK:$t,Z_STREAM_END:St,Z_DEFAULT_COMPRESSION:Ct,Z_DEFAULT_STRATEGY:Vt,Z_DEFLATED:zt}=le;function Nt(e){this.options=dt({level:Ct,method:zt,chunkSize:16384,windowBits:15,memLevel:8,strategy:Vt},e||{});let t=this.options;t.raw&&t.windowBits>0?t.windowBits=-t.windowBits:t.gzip&&t.windowBits>0&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new vt,this.strm.avail_out=0;let n=ot(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(n!==$t)throw new Error(se[n]);if(t.header&&it(this.strm,t.header),t.dictionary){let e;if(e="string"==typeof t.dictionary?mt(t.dictionary):"[object ArrayBuffer]"===yt.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,n=ut(this.strm,e),n!==$t)throw new Error(se[n]);this._dict_set=!0}}function At(e,t){const n=new Nt(t);if(n.push(e,!0),n.err)throw n.msg||se[n.err];return n.result}Nt.prototype.push=function(e,t){const n=this.strm,r=this.options.chunkSize;let a,o;if(this.ended)return!1;for(o=t===~~t?t:!0===t?xt:_t,"string"==typeof e?n.input=mt(e):"[object ArrayBuffer]"===yt.call(e)?n.input=new Uint8Array(e):n.input=e,n.next_in=0,n.avail_in=n.input.length;;)if(0===n.avail_out&&(n.output=new Uint8Array(r),n.next_out=0,n.avail_out=r),(o===wt||o===kt)&&n.avail_out<=6)this.onData(n.output.subarray(0,n.next_out)),n.avail_out=0;else{if(a=st(n,o),a===St)return n.next_out>0&&this.onData(n.output.subarray(0,n.next_out)),a=lt(this.strm),this.onEnd(a),this.ended=!0,a===$t;if(0!==n.avail_out){if(o>0&&n.next_out>0)this.onData(n.output.subarray(0,n.next_out)),n.avail_out=0;else if(0===n.avail_in)break}else this.onData(n.output)}return!0},Nt.prototype.onData=function(e){this.chunks.push(e)},Nt.prototype.onEnd=function(e){e===$t&&(this.result=ht(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg};var Ot={Deflate:Nt,deflate:At,deflateRaw:function(e,t){return(t=t||{}).raw=!0,At(e,t)},gzip:function(e,t){return(t=t||{}).gzip=!0,At(e,t)},constants:le},Et=16209,Dt=function(e,t){let n,r,a,o,i,s,l,u,c,d,h,f,p,m,g,b,v,y,_,w,k,x,$,S;const C=e.state;n=e.next_in,$=e.input,r=n+(e.avail_in-5),a=e.next_out,S=e.output,o=a-(t-e.avail_out),i=a+(e.avail_out-257),s=C.dmax,l=C.wsize,u=C.whave,c=C.wnext,d=C.window,h=C.hold,f=C.bits,p=C.lencode,m=C.distcode,g=(1<<C.lenbits)-1,b=(1<<C.distbits)-1;e:do{f<15&&(h+=$[n++]<<f,f+=8,h+=$[n++]<<f,f+=8),v=p[h&g];t:for(;;){if(y=v>>>24,h>>>=y,f-=y,y=v>>>16&255,0===y)S[a++]=65535&v;else{if(!(16&y)){if(64&y){if(32&y){C.mode=16191;break e}e.msg="invalid literal/length code",C.mode=Et;break e}v=p[(65535&v)+(h&(1<<y)-1)];continue t}for(_=65535&v,y&=15,y&&(f<y&&(h+=$[n++]<<f,f+=8),_+=h&(1<<y)-1,h>>>=y,f-=y),f<15&&(h+=$[n++]<<f,f+=8,h+=$[n++]<<f,f+=8),v=m[h&b];;){if(y=v>>>24,h>>>=y,f-=y,y=v>>>16&255,16&y){if(w=65535&v,y&=15,f<y&&(h+=$[n++]<<f,f+=8,f<y&&(h+=$[n++]<<f,f+=8)),w+=h&(1<<y)-1,w>s){e.msg="invalid distance too far back",C.mode=Et;break e}if(h>>>=y,f-=y,y=a-o,w>y){if(y=w-y,y>u&&C.sane){e.msg="invalid distance too far back",C.mode=Et;break e}if(k=0,x=d,0===c){if(k+=l-y,y<_){_-=y;do{S[a++]=d[k++]}while(--y);k=a-w,x=S}}else if(c<y){if(k+=l+c-y,y-=c,y<_){_-=y;do{S[a++]=d[k++]}while(--y);if(k=0,c<_){y=c,_-=y;do{S[a++]=d[k++]}while(--y);k=a-w,x=S}}}else if(k+=c-y,y<_){_-=y;do{S[a++]=d[k++]}while(--y);k=a-w,x=S}for(;_>2;)S[a++]=x[k++],S[a++]=x[k++],S[a++]=x[k++],_-=3;_&&(S[a++]=x[k++],_>1&&(S[a++]=x[k++]))}else{k=a-w;do{S[a++]=S[k++],S[a++]=S[k++],S[a++]=S[k++],_-=3}while(_>2);_&&(S[a++]=S[k++],_>1&&(S[a++]=S[k++]))}break}if(64&y){e.msg="invalid distance code",C.mode=Et;break e}v=m[(65535&v)+(h&(1<<y)-1)]}}break}}while(n<r&&a<i);_=f>>3,n-=_,f-=_<<3,h&=(1<<f)-1,e.next_in=n,e.next_out=a,e.avail_in=n<r?r-n+5:5-(n-r),e.avail_out=a<i?i-a+257:257-(a-i),C.hold=h,C.bits=f},jt=15,Bt=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),Tt=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),Rt=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Lt=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),Mt=(e,t,n,r,a,o,i,s)=>{const l=s.bits;let u,c,d,h,f,p,m=0,g=0,b=0,v=0,y=0,_=0,w=0,k=0,x=0,$=0,S=null;const C=new Uint16Array(16),V=new Uint16Array(16);let z,N,A,O=null;for(m=0;m<=jt;m++)C[m]=0;for(g=0;g<r;g++)C[t[n+g]]++;for(y=l,v=jt;v>=1&&0===C[v];v--);if(y>v&&(y=v),0===v)return a[o++]=20971520,a[o++]=20971520,s.bits=1,0;for(b=1;b<v&&0===C[b];b++);for(y<b&&(y=b),k=1,m=1;m<=jt;m++)if(k<<=1,k-=C[m],k<0)return-1;if(k>0&&(0===e||1!==v))return-1;for(V[1]=0,m=1;m<jt;m++)V[m+1]=V[m]+C[m];for(g=0;g<r;g++)0!==t[n+g]&&(i[V[t[n+g]]++]=g);if(0===e?(S=O=i,p=20):1===e?(S=Bt,O=Tt,p=257):(S=Rt,O=Lt,p=0),$=0,g=0,m=b,f=o,_=y,w=0,d=-1,x=1<<y,h=x-1,1===e&&x>852||2===e&&x>592)return 1;for(;;){z=m-w,i[g]+1<p?(N=0,A=i[g]):i[g]>=p?(N=O[i[g]-p],A=S[i[g]-p]):(N=96,A=0),u=1<<m-w,c=1<<_,b=c;do{c-=u,a[f+($>>w)+c]=z<<24|N<<16|A}while(0!==c);for(u=1<<m-1;$&u;)u>>=1;if(0!==u?($&=u-1,$+=u):$=0,g++,0===--C[m]){if(m===v)break;m=t[n+i[g]]}if(m>y&&($&h)!==d){for(0===w&&(w=y),f+=b,_=m-w,k=1<<_;_+w<v&&(k-=C[_+w],!(k<=0));)_++,k<<=1;if(x+=1<<_,1===e&&x>852||2===e&&x>592)return 1;d=$&h,a[d]=y<<24|_<<16|f-o}}return 0!==$&&(a[f+$]=m-w<<24|4194304),s.bits=y,0},{Z_FINISH:It,Z_BLOCK:Ut,Z_TREES:Pt,Z_OK:Ft,Z_STREAM_END:Zt,Z_NEED_DICT:Ht,Z_STREAM_ERROR:qt,Z_DATA_ERROR:Yt,Z_MEM_ERROR:Jt,Z_BUF_ERROR:Wt,Z_DEFLATED:Kt}=le,Xt=16180,Gt=16190,Qt=16191,en=16192,tn=16194,nn=16199,rn=16200,an=16206,on=16209,sn=e=>(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24);function ln(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}var un,cn,dn=e=>{if(!e)return 1;const t=e.state;return!t||t.strm!==e||t.mode<Xt||t.mode>16211?1:0},hn=e=>{if(dn(e))return qt;const t=e.state;return e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=Xt,t.last=0,t.havedict=0,t.flags=-1,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Int32Array(852),t.distcode=t.distdyn=new Int32Array(592),t.sane=1,t.back=-1,Ft},fn=e=>{if(dn(e))return qt;const t=e.state;return t.wsize=0,t.whave=0,t.wnext=0,hn(e)},pn=(e,t)=>{let n;if(dn(e))return qt;const r=e.state;return t<0?(n=0,t=-t):(n=5+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?qt:(null!==r.window&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,fn(e))},mn=(e,t)=>{if(!e)return qt;const n=new ln;e.state=n,n.strm=e,n.window=null,n.mode=Xt;const r=pn(e,t);return r!==Ft&&(e.state=null),r},gn=!0,bn=e=>{if(gn){un=new Int32Array(512),cn=new Int32Array(32);let t=0;for(;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(Mt(1,e.lens,0,288,un,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;Mt(2,e.lens,0,32,cn,0,e.work,{bits:5}),gn=!1}e.lencode=un,e.lenbits=9,e.distcode=cn,e.distbits=5},vn=(e,t,n,r)=>{let a;const o=e.state;return null===o.window&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new Uint8Array(o.wsize)),r>=o.wsize?(o.window.set(t.subarray(n-o.wsize,n),0),o.wnext=0,o.whave=o.wsize):(a=o.wsize-o.wnext,a>r&&(a=r),o.window.set(t.subarray(n-r,n-r+a),o.wnext),(r-=a)?(o.window.set(t.subarray(n-r,n),0),o.wnext=r,o.whave=o.wsize):(o.wnext+=a,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=a))),0},yn=fn,_n=mn,wn=(e,t)=>{let n,r,a,o,i,s,l,u,c,d,h,f,p,m,g,b,v,y,_,w,k,x,$=0;const S=new Uint8Array(4);let C,V;const z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(dn(e)||!e.output||!e.input&&0!==e.avail_in)return qt;n=e.state,n.mode===Qt&&(n.mode=en),i=e.next_out,a=e.output,l=e.avail_out,o=e.next_in,r=e.input,s=e.avail_in,u=n.hold,c=n.bits,d=s,h=l,x=Ft;e:for(;;)switch(n.mode){case Xt:if(0===n.wrap){n.mode=en;break}for(;c<16;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(2&n.wrap&&35615===u){0===n.wbits&&(n.wbits=15),n.check=0,S[0]=255&u,S[1]=u>>>8&255,n.check=ie(n.check,S,2,0),u=0,c=0,n.mode=16181;break}if(n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",n.mode=on;break}if((15&u)!==Kt){e.msg="unknown compression method",n.mode=on;break}if(u>>>=4,c-=4,k=8+(15&u),0===n.wbits&&(n.wbits=k),k>15||k>n.wbits){e.msg="invalid window size",n.mode=on;break}n.dmax=1<<n.wbits,n.flags=0,e.adler=n.check=1,n.mode=512&u?16189:Qt,u=0,c=0;break;case 16181:for(;c<16;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(n.flags=u,(255&n.flags)!==Kt){e.msg="unknown compression method",n.mode=on;break}if(57344&n.flags){e.msg="unknown header flags set",n.mode=on;break}n.head&&(n.head.text=u>>8&1),512&n.flags&&4&n.wrap&&(S[0]=255&u,S[1]=u>>>8&255,n.check=ie(n.check,S,2,0)),u=0,c=0,n.mode=16182;case 16182:for(;c<32;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.head&&(n.head.time=u),512&n.flags&&4&n.wrap&&(S[0]=255&u,S[1]=u>>>8&255,S[2]=u>>>16&255,S[3]=u>>>24&255,n.check=ie(n.check,S,4,0)),u=0,c=0,n.mode=16183;case 16183:for(;c<16;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.head&&(n.head.xflags=255&u,n.head.os=u>>8),512&n.flags&&4&n.wrap&&(S[0]=255&u,S[1]=u>>>8&255,n.check=ie(n.check,S,2,0)),u=0,c=0,n.mode=16184;case 16184:if(1024&n.flags){for(;c<16;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.length=u,n.head&&(n.head.extra_len=u),512&n.flags&&4&n.wrap&&(S[0]=255&u,S[1]=u>>>8&255,n.check=ie(n.check,S,2,0)),u=0,c=0}else n.head&&(n.head.extra=null);n.mode=16185;case 16185:if(1024&n.flags&&(f=n.length,f>s&&(f=s),f&&(n.head&&(k=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Uint8Array(n.head.extra_len)),n.head.extra.set(r.subarray(o,o+f),k)),512&n.flags&&4&n.wrap&&(n.check=ie(n.check,r,f,o)),s-=f,o+=f,n.length-=f),n.length))break e;n.length=0,n.mode=16186;case 16186:if(2048&n.flags){if(0===s)break e;f=0;do{k=r[o+f++],n.head&&k&&n.length<65536&&(n.head.name+=String.fromCharCode(k))}while(k&&f<s);if(512&n.flags&&4&n.wrap&&(n.check=ie(n.check,r,f,o)),s-=f,o+=f,k)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=16187;case 16187:if(4096&n.flags){if(0===s)break e;f=0;do{k=r[o+f++],n.head&&k&&n.length<65536&&(n.head.comment+=String.fromCharCode(k))}while(k&&f<s);if(512&n.flags&&4&n.wrap&&(n.check=ie(n.check,r,f,o)),s-=f,o+=f,k)break e}else n.head&&(n.head.comment=null);n.mode=16188;case 16188:if(512&n.flags){for(;c<16;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(4&n.wrap&&u!==(65535&n.check)){e.msg="header crc mismatch",n.mode=on;break}u=0,c=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=Qt;break;case 16189:for(;c<32;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}e.adler=n.check=sn(u),u=0,c=0,n.mode=Gt;case Gt:if(0===n.havedict)return e.next_out=i,e.avail_out=l,e.next_in=o,e.avail_in=s,n.hold=u,n.bits=c,Ht;e.adler=n.check=1,n.mode=Qt;case Qt:if(t===Ut||t===Pt)break e;case en:if(n.last){u>>>=7&c,c-=7&c,n.mode=an;break}for(;c<3;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}switch(n.last=1&u,u>>>=1,c-=1,3&u){case 0:n.mode=16193;break;case 1:if(bn(n),n.mode=nn,t===Pt){u>>>=2,c-=2;break e}break;case 2:n.mode=16196;break;case 3:e.msg="invalid block type",n.mode=on}u>>>=2,c-=2;break;case 16193:for(u>>>=7&c,c-=7&c;c<32;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",n.mode=on;break}if(n.length=65535&u,u=0,c=0,n.mode=tn,t===Pt)break e;case tn:n.mode=16195;case 16195:if(f=n.length,f){if(f>s&&(f=s),f>l&&(f=l),0===f)break e;a.set(r.subarray(o,o+f),i),s-=f,o+=f,l-=f,i+=f,n.length-=f;break}n.mode=Qt;break;case 16196:for(;c<14;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(n.nlen=257+(31&u),u>>>=5,c-=5,n.ndist=1+(31&u),u>>>=5,c-=5,n.ncode=4+(15&u),u>>>=4,c-=4,n.nlen>286||n.ndist>30){e.msg="too many length or distance symbols",n.mode=on;break}n.have=0,n.mode=16197;case 16197:for(;n.have<n.ncode;){for(;c<3;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.lens[z[n.have++]]=7&u,u>>>=3,c-=3}for(;n.have<19;)n.lens[z[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,C={bits:n.lenbits},x=Mt(0,n.lens,0,19,n.lencode,0,n.work,C),n.lenbits=C.bits,x){e.msg="invalid code lengths set",n.mode=on;break}n.have=0,n.mode=16198;case 16198:for(;n.have<n.nlen+n.ndist;){for(;$=n.lencode[u&(1<<n.lenbits)-1],g=$>>>24,b=$>>>16&255,v=65535&$,!(g<=c);){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(v<16)u>>>=g,c-=g,n.lens[n.have++]=v;else{if(16===v){for(V=g+2;c<V;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(u>>>=g,c-=g,0===n.have){e.msg="invalid bit length repeat",n.mode=on;break}k=n.lens[n.have-1],f=3+(3&u),u>>>=2,c-=2}else if(17===v){for(V=g+3;c<V;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}u>>>=g,c-=g,k=0,f=3+(7&u),u>>>=3,c-=3}else{for(V=g+7;c<V;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}u>>>=g,c-=g,k=0,f=11+(127&u),u>>>=7,c-=7}if(n.have+f>n.nlen+n.ndist){e.msg="invalid bit length repeat",n.mode=on;break}for(;f--;)n.lens[n.have++]=k}}if(n.mode===on)break;if(0===n.lens[256]){e.msg="invalid code -- missing end-of-block",n.mode=on;break}if(n.lenbits=9,C={bits:n.lenbits},x=Mt(1,n.lens,0,n.nlen,n.lencode,0,n.work,C),n.lenbits=C.bits,x){e.msg="invalid literal/lengths set",n.mode=on;break}if(n.distbits=6,n.distcode=n.distdyn,C={bits:n.distbits},x=Mt(2,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,C),n.distbits=C.bits,x){e.msg="invalid distances set",n.mode=on;break}if(n.mode=nn,t===Pt)break e;case nn:n.mode=rn;case rn:if(s>=6&&l>=258){e.next_out=i,e.avail_out=l,e.next_in=o,e.avail_in=s,n.hold=u,n.bits=c,Dt(e,h),i=e.next_out,a=e.output,l=e.avail_out,o=e.next_in,r=e.input,s=e.avail_in,u=n.hold,c=n.bits,n.mode===Qt&&(n.back=-1);break}for(n.back=0;$=n.lencode[u&(1<<n.lenbits)-1],g=$>>>24,b=$>>>16&255,v=65535&$,!(g<=c);){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(b&&!(240&b)){for(y=g,_=b,w=v;$=n.lencode[w+((u&(1<<y+_)-1)>>y)],g=$>>>24,b=$>>>16&255,v=65535&$,!(y+g<=c);){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}u>>>=y,c-=y,n.back+=y}if(u>>>=g,c-=g,n.back+=g,n.length=v,0===b){n.mode=16205;break}if(32&b){n.back=-1,n.mode=Qt;break}if(64&b){e.msg="invalid literal/length code",n.mode=on;break}n.extra=15&b,n.mode=16201;case 16201:if(n.extra){for(V=n.extra;c<V;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.length+=u&(1<<n.extra)-1,u>>>=n.extra,c-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=16202;case 16202:for(;$=n.distcode[u&(1<<n.distbits)-1],g=$>>>24,b=$>>>16&255,v=65535&$,!(g<=c);){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(!(240&b)){for(y=g,_=b,w=v;$=n.distcode[w+((u&(1<<y+_)-1)>>y)],g=$>>>24,b=$>>>16&255,v=65535&$,!(y+g<=c);){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}u>>>=y,c-=y,n.back+=y}if(u>>>=g,c-=g,n.back+=g,64&b){e.msg="invalid distance code",n.mode=on;break}n.offset=v,n.extra=15&b,n.mode=16203;case 16203:if(n.extra){for(V=n.extra;c<V;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}n.offset+=u&(1<<n.extra)-1,u>>>=n.extra,c-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg="invalid distance too far back",n.mode=on;break}n.mode=16204;case 16204:if(0===l)break e;if(f=h-l,n.offset>f){if(f=n.offset-f,f>n.whave&&n.sane){e.msg="invalid distance too far back",n.mode=on;break}f>n.wnext?(f-=n.wnext,p=n.wsize-f):p=n.wnext-f,f>n.length&&(f=n.length),m=n.window}else m=a,p=i-n.offset,f=n.length;f>l&&(f=l),l-=f,n.length-=f;do{a[i++]=m[p++]}while(--f);0===n.length&&(n.mode=rn);break;case 16205:if(0===l)break e;a[i++]=n.length,l--,n.mode=rn;break;case an:if(n.wrap){for(;c<32;){if(0===s)break e;s--,u|=r[o++]<<c,c+=8}if(h-=l,e.total_out+=h,n.total+=h,4&n.wrap&&h&&(e.adler=n.check=n.flags?ie(n.check,a,h,i-h):ae(n.check,a,h,i-h)),h=l,4&n.wrap&&(n.flags?u:sn(u))!==n.check){e.msg="incorrect data check",n.mode=on;break}u=0,c=0}n.mode=16207;case 16207:if(n.wrap&&n.flags){for(;c<32;){if(0===s)break e;s--,u+=r[o++]<<c,c+=8}if(4&n.wrap&&u!==(4294967295&n.total)){e.msg="incorrect length check",n.mode=on;break}u=0,c=0}n.mode=16208;case 16208:x=Zt;break e;case on:x=Yt;break e;case 16210:return Jt;default:return qt}return e.next_out=i,e.avail_out=l,e.next_in=o,e.avail_in=s,n.hold=u,n.bits=c,(n.wsize||h!==e.avail_out&&n.mode<on&&(n.mode<an||t!==It))&&vn(e,e.output,e.next_out,h-e.avail_out),d-=e.avail_in,h-=e.avail_out,e.total_in+=d,e.total_out+=h,n.total+=h,4&n.wrap&&h&&(e.adler=n.check=n.flags?ie(n.check,a,h,e.next_out-h):ae(n.check,a,h,e.next_out-h)),e.data_type=n.bits+(n.last?64:0)+(n.mode===Qt?128:0)+(n.mode===nn||n.mode===tn?256:0),(0===d&&0===h||t===It)&&x===Ft&&(x=Wt),x},kn=e=>{if(dn(e))return qt;let t=e.state;return t.window&&(t.window=null),e.state=null,Ft},xn=(e,t)=>{if(dn(e))return qt;const n=e.state;return 2&n.wrap?(n.head=t,t.done=!1,Ft):qt},$n=(e,t)=>{const n=t.length;let r,a,o;return dn(e)?qt:(r=e.state,0!==r.wrap&&r.mode!==Gt?qt:r.mode===Gt&&(a=1,a=ae(a,t,n,0),a!==r.check)?Yt:(o=vn(e,t,n,n),o?(r.mode=16210,Jt):(r.havedict=1,Ft)))};var Sn=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1},Cn=Object.prototype.toString,{Z_NO_FLUSH:Vn,Z_FINISH:zn,Z_OK:Nn,Z_STREAM_END:An,Z_NEED_DICT:On,Z_STREAM_ERROR:En,Z_DATA_ERROR:Dn,Z_MEM_ERROR:jn}=le;function Bn(e){this.options=dt({chunkSize:65536,windowBits:15,to:""},e||{});const t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&(15&t.windowBits||(t.windowBits|=15)),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new vt,this.strm.avail_out=0;let n=_n(this.strm,t.windowBits);if(n!==Nn)throw new Error(se[n]);if(this.header=new Sn,xn(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=mt(t.dictionary):"[object ArrayBuffer]"===Cn.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(n=$n(this.strm,t.dictionary),n!==Nn)))throw new Error(se[n])}function Tn(e,t){const n=new Bn(t);if(n.push(e),n.err)throw n.msg||se[n.err];return n.result}Bn.prototype.push=function(e,t){const n=this.strm,r=this.options.chunkSize,a=this.options.dictionary;let o,i,s;if(this.ended)return!1;for(i=t===~~t?t:!0===t?zn:Vn,"[object ArrayBuffer]"===Cn.call(e)?n.input=new Uint8Array(e):n.input=e,n.next_in=0,n.avail_in=n.input.length;;){for(0===n.avail_out&&(n.output=new Uint8Array(r),n.next_out=0,n.avail_out=r),o=wn(n,i),o===On&&a&&(o=$n(n,a),o===Nn?o=wn(n,i):o===Dn&&(o=On));n.avail_in>0&&o===An&&n.state.wrap>0&&0!==e[n.next_in];)yn(n),o=wn(n,i);switch(o){case En:case Dn:case On:case jn:return this.onEnd(o),this.ended=!0,!1}if(s=n.avail_out,n.next_out&&(0===n.avail_out||o===An))if("string"===this.options.to){let e=bt(n.output,n.next_out),t=n.next_out-e,a=gt(n.output,e);n.next_out=t,n.avail_out=r-t,t&&n.output.set(n.output.subarray(e,e+t),0),this.onData(a)}else this.onData(n.output.length===n.next_out?n.output:n.output.subarray(0,n.next_out));if(o!==Nn||0!==s){if(o===An)return o=kn(this.strm),this.onEnd(o),this.ended=!0,!0;if(0===n.avail_in)break}}return!0},Bn.prototype.onData=function(e){this.chunks.push(e)},Bn.prototype.onEnd=function(e){e===Nn&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=ht(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg};var Rn={Inflate:Bn,inflate:Tn,inflateRaw:function(e,t){return(t=t||{}).raw=!0,Tn(e,t)},ungzip:Tn,constants:le},{Deflate:Ln,deflate:Mn,deflateRaw:In,gzip:Un}=Ot,{Inflate:Pn,inflate:Fn,inflateRaw:Zn,ungzip:Hn}=Rn,qn=Un,Yn="__";function Jn(){return(Jn=p(function*(e,t){const n=t.substring(t.length-11)+t.substring(1,5),r=(new TextEncoder).encode(e),a=(new TextEncoder).encode(n),o=a.length,i=qn(r,{level:6}).map((e,t)=>e^a[t%o]);return new Blob([i],{type:"sly"})})).apply(this,arguments)}function Wn(e,t){if(t)return t(e);const{action:n,message:r}=e;if(r&&$.error(r),4!==n&&401!==e.status||$.gotoLogin(),1===n)return zen.instance.$router.go(-1);throw e}function Kn(e,t){if(t)return t.call(this,e);let{action:n,data:r,message:a}=e;switch(n){case 0:case 2:case 6:if(a&&$.success(a),2==n)return"/"===r[0]?zen.instance.$router.push("/403"):window.location=r;break;case 1:return zen.instance.$router.go(-1);case 3:return $.refresh()}return r}var Xn={};function Gn(e,t,n){return Qn.apply(this,arguments)}function Qn(){return Qn=p(function*(e,{data:t,url:n,file:r,success:a,fail:o,encrypt:i=window._ept_},s){if(!n)return $.error("\u63a5\u53e3\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a");let l=null;if(s&&s.$){if(l="p"+s.$.uid,Xn[l])return;Xn[l]=!0}let u={Zid:$.sid()};const c=$.token()||Yn+$.uid(16);u.Token=c;const d=$.tenant();d&&(u.App=d);let h=function(e,t){const{host:n,app:r}=zen;if(e.indexOf("//")>-1)return{url:e,data:t};const a=e.split("/").length,{name:o}=r;return n?"string"==typeof n?5===a&&n.indexOf("/"+o)>-1?{url:n.substring(0,n.length-o.length-1)+e,data:t}:{url:n+e,data:t}:n(e,t):((4===a||a<3)&&(e=`/${o}${e}`),{url:e,data:t})}(n,t),f=h.data;if((r||i)&&f){const e=new FormData;if(i){const t=yield function(e,t){return Jn.apply(this,arguments)}(JSON.stringify(f),c);e.append(Yn,t,Yn)}else Object.keys(f).forEach(n=>e.append(n,t[n]));r&&e.append("file",r),f=e}else u["Content-Type"]="application/json",f=JSON.stringify(f);const p=e?$.loading(!0):null;return fetch(h.url,{method:"POST",credentials:"omit",headers:u,body:f}).then(e=>{if(e.status>=200&&e.status<300)return e.json();throw l&&delete Xn[l],new Error(h.url+"\u8bf7\u6c42\u5f02\u5e38")}).then((t={})=>(l&&delete Xn[l],e&&p.close(),!1===t.success?Wn.call(s,t,o):Kn.call(s,t,a))).catch(t=>{if(e&&p.close(),l&&delete Xn[l],!1===t.success)throw t;Wn(r?new Error("\u4e0a\u4f20\u6587\u4ef6\u4f53\u79ef\u8fc7\u5927"+t.message):t,o)})}),Qn.apply(this,arguments)}var er=class{send(e,t){var n=this;return p(function*(){if(!e)return $.error("\u6d88\u606f\u7c7b\u578b\u548c\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a");const r=yield $.post({url:"/sse",data:e}),{name:a}=zen.app;let o="/sse";if(a&&(o=`/${a}${o}`),n.eventSource)return;const i=new EventSource(o+"?id="+r);i.onopen=e=>{},i.onmessage=e=>{const{data:n}=e;t(n?JSON.parse(n):null,e)},i.onerror=()=>{n.close()},n.eventSource=i})()}close(){this.eventSource&&(this.eventSource.close(),this.eventSource=null)}},tr=null;function nr(e,t){return tr||(tr=new er,window.addEventListener("beforeunload",()=>{tr.close()})),tr.send(e,t)}function rr(e){return(rr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ar(e){var t=function(e,t){if("object"!=rr(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!=rr(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==rr(t)?t:t+""}function or(e,t,n){return(t=ar(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var ir=class{constructor(){or(this,"socket",null),or(this,"reconnectAttempts",0),or(this,"heartbeatTimer",void 0),or(this,"messages",{}),or(this,"listeners",{})}send(e,t,n,r){if(!e||!t)return $.error("\u6d88\u606f\u7c7b\u578b\u548c\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a");n&&(this.listeners[e]=n);const a=$.uid(),o={type:e,data:t,id:a,token:$.token()},i=$.tenant();return i&&(o.tenant=i),this.socket&&this.socket.readyState===WebSocket.OPEN?this.socket.send(JSON.stringify(o)):this.connect(()=>this.socket.send(JSON.stringify(o))),new Promise((e,t)=>{const n=setTimeout(()=>{const{reject:e}=this.messages[a];e(a+"\u8bf7\u6c42\u8d85\u65f6")},r);this.messages[a]={resolve:e,timer:n,reject:t}})}connect(e){const{name:t}=zen.app;let n="/ws";t&&(n=`/${t}${n}`),this.reconnectAttempts,this.socket&&this.socket.readyState===WebSocket.OPEN||(this.socket=new WebSocket(n),this.socket.onopen=t=>{this.reconnectAttempts=0,this.startHeartbeat(),e&&e()},this.socket.onmessage=e=>{const t=JSON.parse(e.data),{id:n}=t,{messages:r,listeners:a}=this;if(r[n]){const{resolve:e,timer:a}=r[n];clearTimeout(a),e(t),delete r[n]}else a[n]&&a[n](t);this.startHeartbeat()},this.socket.onclose=e=>{this.reconnectAttempts},this.socket.onerror=e=>{this.reconnectAttempts,this.closeHeartbeat()})}close(){this.socket&&(this.socket.close(),this.socket=null),this.closeHeartbeat()}startHeartbeat(){this.heartbeatTimer&&this.closeHeartbeat(),this.heartbeatTimer=setInterval(()=>{this.socket&&this.socket.send(JSON.stringify({type:"_heartBeat",token:$.token()}))},3e4)}closeHeartbeat(){clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0}},sr=null;function lr(e,t,n,r=6e4){return sr||(sr=new ir,window.addEventListener("beforeunload",()=>{sr.close()})),sr.send(e,t,n,r)}function ur(e,t=400,n){let r;function a(){const a=arguments;clearTimeout(r),!0===n&&void 0===r&&e.apply(this,a),r=setTimeout(()=>{r=void 0,!0!==n&&e.apply(this,a)},t)}return a.cancel=()=>{clearTimeout(r)},a}function cr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function dr(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?cr(Object(n),!0).forEach(function(t){or(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):cr(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var hr=(t,n)=>r=>{const{size:a=16,width:o=1.5,tooltip:i,type:s="",badge:l,color:u="currentColor"}=r,c=(0,e.h)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:u,"stroke-width":o,"stroke-linecap":"round","stroke-linejoin":"round",width:a,height:a,name:t},n.map(t=>(0,e.h)(...t))),d=$.omit(r,["size","width","type","tooltip","color","badge"]);let h="z-i";s&&(h+=" "+s),d.class=h;const f=(0,e.h)("span",dr({},d),[c]);let p=null;if(l){const{vant:t}=window;p=t?(0,e.h)((0,e.resolveComponent)("van-badge"),"dot"===l?{dot:!0}:{content:l,max:99},{default:()=>f}):(0,e.h)((0,e.resolveComponent)("ElBadge"),"dot"===l?{isDot:!0}:{value:l,max:999},{default:()=>f})}const m=p||f;if(i){const t=(0,e.resolveComponent)("ElTooltip");if(t)return(0,e.h)(t,{content:i},{default:()=>f})}return m},fr={js:[],css:[]},pr=window.document;function mr(e,t){for(let n=0;n<t.length;n++)if(t[n]===e)return!0;return!1}var gr=function(e,t,n,r,a){this.shadowDom=r,this.pending=[...e],this.callback=t,this.timer=a,e.forEach(e=>{if(e.indexOf(".css")>0)return this.css(e);this.js(e,n)})};gr.prototype.pending=[],gr.prototype.timer=null,gr.prototype.callback=null,gr.prototype.finish=function(e){const t=this.pending.indexOf(e);if(this.pending.splice(t,1),0===this.pending.length){if(this.timer)return setTimeout(this.callback,this.timer);this.callback()}},gr.prototype.css=function(e){if(!mr(e,fr.css)){fr.css.push(e);const t=this.shadowDom||pr.head;let n=pr.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,t.appendChild(n)}this.finish(e)},gr.prototype.js=function(e,t){if(mr(e,fr.js))return this.finish(e);let n=pr.createElement("script");n.src=e;n.onerror=n.onload=r=>{if(r&&"error"===r.type)return t?t(e):$.error(e+"\u8d44\u6e90\u52a0\u8f7d\u5931\u8d25");n.onerror=n.onload=null,fr.js.push(e),this.finish(e)},(this.shadowDom||pr.body).appendChild(n)};var br={lib(e,t,n,r){const a=Array.isArray(e)?e:[e];return a.forEach((e,t)=>{-1===e.indexOf("//")&&(a[t]=zen.path("lib/"+a[t]))}),new Promise(e=>{new gr(a,t||e,n,r)})},resource(e,t){const n=Array.isArray(e)?e:[e];return n.forEach((e,t)=>{-1===e.indexOf("//")&&(n[t]=zen.path(n[t]))}),new Promise(e=>{new gr(n,e,null,null,t)})}},vr=!1,yr=function(){return vr||("LOCAL_DEV"!==window.ENV_||zen.app.tag||(vr=!0),vr)};var _r=function e(t,n="0"){let r=[];if(!t)return r;let a=0;for(;t.length>a;){if(t[a].parentId!==n){a++;continue}let o=t.splice(a,1)[0];3!==o.type&&(o.children=e(t,o.id),r.push(o),a=0)}return r},wr="\u60a8\u6ca1\u6709\u7cfb\u7edf\u8bbf\u95ee\u6743\u9650";function kr(e){return xr.apply(this,arguments)}function xr(){return(xr=p(function*(e){const{name:t}=e,{pages:n,points:r}=yield $.get({url:"/kooteam/api/user/menusByApp",data:{name:t}});if(0===n.length)throw $.error(wr),zen.instance.$router.push("/403"),new Error(wr);const a=yield $.get({url:`/${t}/api/zen/app`});e.tag=a.tag,e.tenant=a.multiTenant||0;let o=a.menus||[];return yr()||(o=o.filter(e=>n.includes(e.id))),e.menus=_r(o),e.points=r,!0})).apply(this,arguments)}function $r(e){return Sr.apply(this,arguments)}function Sr(){return(Sr=p(function*(e,t="/welcome"){const{_apps:n}=window;if(n)for(let r=0;r<n.length;r++){const a=n[r];if(a.name!==e)continue;if(!a.menus&&!1===(yield kr(a)))return;if(zen.app.name===e)return $.emit("menuUpdate",t.substring(1),a.menus);let o=document.getElementById("J_"+zen.app.name);o&&(o.style.display="none");const{alias:i,tag:s}=a;zen.app={name:e,tag:s,alias:i};let l=document.getElementById("J_"+e);if(l&&a.instance){zen.instance=a.instance;const{$route:e}=zen.instance;e&&(t=e.path),window.history.replaceState(null,null,`/${i}${t}`),l.style.display="block"}else window.history.replaceState(null,null,`/${i}${t}`),yield $.resource("app.js");$.emit("menuUpdate",t.substring(1),a.menus),$.emit("_appChange",e)}})).apply(this,arguments)}function Cr(e,t){let n="";!t&&(t=document.title);for(const a of[...document.querySelectorAll('link[rel="stylesheet"], style')])n+=a.outerHTML;const r=window.open("","","left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");r.document.write(`<!DOCTYPE html><html><head><title>${t}</title>${n}</head><body>${e.outerHTML}</body></html>`),setTimeout(()=>{r.document.close(),r.focus(),r.open(),r.print(),r.close()},1e3)}function Vr(e,t=400){let n,r=!1;return function(){return!1===r&&(r=!0,setTimeout(()=>{r=!1},t),n=e.apply(this,arguments)),n}}for(var zr=36,Nr="";zr--;)Nr+=zr.toString(36);function Ar(e){for(var t="",n=e||11;n--;)t+=Nr[36*Math.random()|0];return t}var Or=["table","list","checkbox"];var Er=function e(t,n){let{name:r,multiple:a,children:o}=t;r?void 0===n[r]&&(void 0!==t.default?n[r]=t.default:o?(n[r]={},o.forEach(t=>e(t,n[r]))):n[r]=a||Or.includes(t.type)?[]:null):o&&o.forEach(t=>e(t,n))},Dr={grad:.9,turn:360,rad:360/(2*Math.PI)},jr=function(e){return"string"==typeof e?e.length>0:"number"==typeof e},Br=function(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=Math.pow(10,t)),Math.round(n*e)/n+0},Tr=function(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=1),e>n?n:e>t?e:t},Rr=function(e){return(e=isFinite(e)?e%360:0)>0?e:e+360},Lr=function(e){return{r:Tr(e.r,0,255),g:Tr(e.g,0,255),b:Tr(e.b,0,255),a:Tr(e.a)}},Mr=function(e){return{r:Br(e.r),g:Br(e.g),b:Br(e.b),a:Br(e.a,3)}},Ir=/^#([0-9a-f]{3,8})$/i,Ur=function(e){var t=e.toString(16);return t.length<2?"0"+t:t},Pr=function(e){var t=e.r,n=e.g,r=e.b,a=e.a,o=Math.max(t,n,r),i=o-Math.min(t,n,r),s=i?o===t?(n-r)/i:o===n?2+(r-t)/i:4+(t-n)/i:0;return{h:60*(s<0?s+6:s),s:o?i/o*100:0,v:o/255*100,a:a}},Fr=function(e){var t=e.h,n=e.s,r=e.v,a=e.a;t=t/360*6,n/=100,r/=100;var o=Math.floor(t),i=r*(1-n),s=r*(1-(t-o)*n),l=r*(1-(1-t+o)*n),u=o%6;return{r:255*[r,s,i,i,l,r][u],g:255*[l,r,r,s,i,i][u],b:255*[i,i,l,r,r,s][u],a:a}},Zr=function(e){return{h:Rr(e.h),s:Tr(e.s,0,100),l:Tr(e.l,0,100),a:Tr(e.a)}},Hr=function(e){return{h:Br(e.h),s:Br(e.s),l:Br(e.l),a:Br(e.a,3)}},qr=function(e){return Fr((n=(t=e).s,{h:t.h,s:(n*=((r=t.l)<50?r:100-r)/100)>0?2*n/(r+n)*100:0,v:r+n,a:t.a}));var t,n,r},Yr=function(e){return{h:(t=Pr(e)).h,s:(a=(200-(n=t.s))*(r=t.v)/100)>0&&a<200?n*r/100/(a<=100?a:200-a)*100:0,l:a/2,a:t.a};var t,n,r,a},Jr=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,Wr=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,Kr=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,Xr=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,Gr={string:[[function(e){var t=Ir.exec(e);return t?(e=t[1]).length<=4?{r:parseInt(e[0]+e[0],16),g:parseInt(e[1]+e[1],16),b:parseInt(e[2]+e[2],16),a:4===e.length?Br(parseInt(e[3]+e[3],16)/255,2):1}:6===e.length||8===e.length?{r:parseInt(e.substr(0,2),16),g:parseInt(e.substr(2,2),16),b:parseInt(e.substr(4,2),16),a:8===e.length?Br(parseInt(e.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(e){var t=Kr.exec(e)||Xr.exec(e);return t?t[2]!==t[4]||t[4]!==t[6]?null:Lr({r:Number(t[1])/(t[2]?100/255:1),g:Number(t[3])/(t[4]?100/255:1),b:Number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:Number(t[7])/(t[8]?100:1)}):null},"rgb"],[function(e){var t,n,r=Jr.exec(e)||Wr.exec(e);return r?qr(Zr({h:(t=r[1],n=r[2],void 0===n&&(n="deg"),Number(t)*(Dr[n]||1)),s:Number(r[3]),l:Number(r[4]),a:void 0===r[5]?1:Number(r[5])/(r[6]?100:1)})):null},"hsl"]],object:[[function(e){var t=e.r,n=e.g,r=e.b,a=e.a,o=void 0===a?1:a;return jr(t)&&jr(n)&&jr(r)?Lr({r:Number(t),g:Number(n),b:Number(r),a:Number(o)}):null},"rgb"],[function(e){var t=e.h,n=e.s,r=e.l,a=e.a,o=void 0===a?1:a;return jr(t)&&jr(n)&&jr(r)?qr(Zr({h:Number(t),s:Number(n),l:Number(r),a:Number(o)})):null},"hsl"],[function(e){var t,n=e.h,r=e.s,a=e.v,o=e.a,i=void 0===o?1:o;return jr(n)&&jr(r)&&jr(a)?Fr((t={h:Number(n),s:Number(r),v:Number(a),a:Number(i)},{h:Rr(t.h),s:Tr(t.s,0,100),v:Tr(t.v,0,100),a:Tr(t.a)})):null},"hsv"]]},Qr=function(e,t){for(var n=0;n<t.length;n++){var r=t[n][0](e);if(r)return[r,t[n][1]]}return[null,void 0]},ea=function(e){return"string"==typeof e?Qr(e.trim(),Gr.string):"object"==typeof e&&null!==e?Qr(e,Gr.object):[null,void 0]},ta=function(e,t){var n=Yr(e);return{h:n.h,s:Tr(n.s+100*t,0,100),l:n.l,a:n.a}},na=function(e){return(299*e.r+587*e.g+114*e.b)/1e3/255},ra=function(e,t){var n=Yr(e);return{h:n.h,s:n.s,l:Tr(n.l+100*t,0,100),a:n.a}},aa=function(){function e(e){this.parsed=ea(e)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1}}return e.prototype.isValid=function(){return null!==this.parsed},e.prototype.brightness=function(){return Br(na(this.rgba),2)},e.prototype.isDark=function(){return na(this.rgba)<.5},e.prototype.isLight=function(){return na(this.rgba)>=.5},e.prototype.toHex=function(){return t=(e=Mr(this.rgba)).r,n=e.g,r=e.b,o=(a=e.a)<1?Ur(Br(255*a)):"","#"+Ur(t)+Ur(n)+Ur(r)+o;var e,t,n,r,a,o},e.prototype.toRgb=function(){return Mr(this.rgba)},e.prototype.toRgbString=function(){return t=(e=Mr(this.rgba)).r,n=e.g,r=e.b,(a=e.a)<1?"rgba("+t+", "+n+", "+r+", "+a+")":"rgb("+t+", "+n+", "+r+")";var e,t,n,r,a},e.prototype.toHsl=function(){return Hr(Yr(this.rgba))},e.prototype.toHslString=function(){return t=(e=Hr(Yr(this.rgba))).h,n=e.s,r=e.l,(a=e.a)<1?"hsla("+t+", "+n+"%, "+r+"%, "+a+")":"hsl("+t+", "+n+"%, "+r+"%)";var e,t,n,r,a},e.prototype.toHsv=function(){return e=Pr(this.rgba),{h:Br(e.h),s:Br(e.s),v:Br(e.v),a:Br(e.a,3)};var e},e.prototype.invert=function(){return oa({r:255-(e=this.rgba).r,g:255-e.g,b:255-e.b,a:e.a});var e},e.prototype.saturate=function(e){return void 0===e&&(e=.1),oa(ta(this.rgba,e))},e.prototype.desaturate=function(e){return void 0===e&&(e=.1),oa(ta(this.rgba,-e))},e.prototype.grayscale=function(){return oa(ta(this.rgba,-1))},e.prototype.lighten=function(e){return void 0===e&&(e=.1),oa(ra(this.rgba,e))},e.prototype.darken=function(e){return void 0===e&&(e=.1),oa(ra(this.rgba,-e))},e.prototype.rotate=function(e){return void 0===e&&(e=15),this.hue(this.hue()+e)},e.prototype.alpha=function(e){return"number"==typeof e?oa({r:(t=this.rgba).r,g:t.g,b:t.b,a:e}):Br(this.rgba.a,3);var t},e.prototype.hue=function(e){var t=Yr(this.rgba);return"number"==typeof e?oa({h:e,s:t.s,l:t.l,a:t.a}):Br(t.h)},e.prototype.isEqual=function(e){return this.toHex()===oa(e).toHex()},e}(),oa=function(e){return e instanceof aa?e:new aa(e)},ia=[],sa=function(e){var t=e/255;return t<.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)},la=function(e){return.2126*sa(e.r)+.7152*sa(e.g)+.0722*sa(e.b)};var ua=function(e){return"string"==typeof e?e.length>0:"number"==typeof e},ca=function(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=Math.pow(10,t)),Math.round(n*e)/n+0},da=function(e,t,n){return void 0===t&&(t=0),void 0===n&&(n=1),e>n?n:e>t?e:t},ha=function(e){return{c:da(e.c,0,100),m:da(e.m,0,100),y:da(e.y,0,100),k:da(e.k,0,100),a:da(e.a)}},fa=function(e){return{c:ca(e.c,2),m:ca(e.m,2),y:ca(e.y,2),k:ca(e.k,2),a:ca(e.a,3)}};function pa(e){return{r:ca(255*(1-e.c/100)*(1-e.k/100)),g:ca(255*(1-e.m/100)*(1-e.k/100)),b:ca(255*(1-e.y/100)*(1-e.k/100)),a:e.a}}function ma(e){var t=1-Math.max(e.r/255,e.g/255,e.b/255),n=(1-e.r/255-t)/(1-t),r=(1-e.g/255-t)/(1-t),a=(1-e.b/255-t)/(1-t);return{c:isNaN(n)?0:ca(100*n),m:isNaN(r)?0:ca(100*r),y:isNaN(a)?0:ca(100*a),k:ca(100*t),a:e.a}}function ga(e){var t=e.c,n=e.m,r=e.y,a=e.k,o=e.a,i=void 0===o?1:o;return ua(t)&&ua(n)&&ua(r)&&ua(a)?pa(ha({c:Number(t),m:Number(n),y:Number(r),k:Number(a),a:Number(i)})):null}var ba=/^device-cmyk\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,va=function(e){var t=ba.exec(e);return t?pa(ha({c:Number(t[1])*(t[2]?1:100),m:Number(t[3])*(t[4]?1:100),y:Number(t[5])*(t[6]?1:100),k:Number(t[7])*(t[8]?1:100),a:void 0===t[9]?1:Number(t[9])/(t[10]?100:1)})):null};function ya(e,t,n){let r=e/255,a=t/255,o=n/255;r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92,a=a>.04045?Math.pow((a+.055)/1.055,2.4):a/12.92,o=o>.04045?Math.pow((o+.055)/1.055,2.4):o/12.92;let i=.4124*r+.3576*a+.1805*o,s=.2126*r+.7152*a+.0722*o,l=.0193*r+.1192*a+.9505*o;i/=.95047,s/=1,l/=1.08883;const u=e=>e>.008856?Math.pow(e,1/3):7.787*e+16/116,c=u(i),d=u(s);return[116*d-16,500*(c-d),200*(d-u(l))]}function _a(e,t){const n=e[0]-t[0],r=e[1]-t[1],a=e[2]-t[2];return Math.sqrt(n*n+r*r+a*a)}function wa(e){return"#"+e.map(e=>{const t=Math.round(e).toString(16);return 1===t.length?"0"+t:t}).join("")}function ka(e,t,n=10){const r=[],a=e.data,o=e.width,i=e.height;for(let s=0;s<i;s++)for(let e=0;e<o;e++){if(!t(e,s))continue;const i=4*(s*o+e);if(0===a[i+3])continue;const l=a[i],u=a[i+1],c=a[i+2],d=ya(l,u,c);let h=!1;for(const e of r)if(_a(d,e.averageLab)<n){e.count++,e.sumRgb[0]+=l,e.sumRgb[1]+=u,e.sumRgb[2]+=c,e.sumLab[0]+=d[0],e.sumLab[1]+=d[1],e.sumLab[2]+=d[2],e.averageRgb=[e.sumRgb[0]/e.count,e.sumRgb[1]/e.count,e.sumRgb[2]/e.count],e.averageLab=[e.sumLab[0]/e.count,e.sumLab[1]/e.count,e.sumLab[2]/e.count],h=!0;break}h||r.push({count:1,sumRgb:[l,u,c],sumLab:[d[0],d[1],d[2]],averageRgb:[l,u,c],averageLab:[d[0],d[1],d[2]]})}return r}[function(e){e.prototype.luminance=function(){return e=la(this.rgba),void 0===(t=2)&&(t=0),void 0===n&&(n=Math.pow(10,t)),Math.round(n*e)/n+0;var e,t,n},e.prototype.contrast=function(t){void 0===t&&(t="#FFF");var n,r,a,o,i,s,l,u=t instanceof e?t:new e(t);return o=this.rgba,i=u.toRgb(),n=(s=la(o))>(l=la(i))?(s+.05)/(l+.05):(l+.05)/(s+.05),void 0===(r=2)&&(r=0),void 0===a&&(a=Math.pow(10,r)),Math.floor(a*n)/a+0},e.prototype.isReadable=function(e,t){return void 0===e&&(e="#FFF"),void 0===t&&(t={}),this.contrast(e)>=(i=void 0===(o=(n=t).size)?"normal":o,"AAA"===(a=void 0===(r=n.level)?"AA":r)&&"normal"===i?7:"AA"===a&&"large"===i?3:4.5);var n,r,a,o,i}},function(e,t){e.prototype.toCmyk=function(){return fa(ma(this.rgba))},e.prototype.toCmykString=function(){return t=(e=fa(ma(this.rgba))).c,n=e.m,r=e.y,a=e.k,(o=e.a)<1?"device-cmyk("+t+"% "+n+"% "+r+"% "+a+"% / "+o+")":"device-cmyk("+t+"% "+n+"% "+r+"% "+a+"%)";var e,t,n,r,a,o},t.object.push([ga,"cmyk"]),t.string.push([va,"cmyk"])}].forEach(function(e){ia.indexOf(e)<0&&(e(aa,Gr),ia.push(e))});var xa=function(){var e=p(function*(e,t){const{maxSize:n,threshold:r}=function(e){e||(e={});const{maxSize:t=100}=e;let n=e.threshold||10;return n="number"==typeof n?{primary:n,left:n,right:n,top:n,bottom:n}:{primary:n.primary||10,left:n.left||10,right:n.right||10,top:n.top||10,bottom:n.bottom||10},{maxSize:t,threshold:n}}(t),a=yield function(e){return new Promise((t,n)=>{let r;"string"==typeof e?(r=new Image,r.crossOrigin="Anonymous",r.src=e):r=e,r.complete?t(r):(r.onload=()=>t(r),r.onerror=e=>n(e))})}(e),o=function(e,t=200){const n=document.createElement("canvas");let r=e.naturalWidth,a=e.naturalHeight;if(r>t||a>t){const e=Math.min(t/r,t/a);r=Math.floor(r*e),a=Math.floor(a*e)}n.width=r,n.height=a;const o=n.getContext("2d");if(!o)throw new Error("\u65e0\u6cd5\u83b7\u53d6 Canvas \u4e0a\u4e0b\u6587");return o.drawImage(e,0,0,r,a),o.getImageData(0,0,r,a)}(a,n);let i=ka(o,()=>!0,r.primary);i.sort((e,t)=>t.count-e.count);const s=i[0],l=i.length>1?i[1]:i[0],u=wa(s.averageRgb),c=wa(l.averageRgb),d=o.width,h=o.height,f=ka(o,(e,t)=>t<10,r.top);f.sort((e,t)=>t.count-e.count);const p=f.length>0?wa(f[0].averageRgb):u,m=ka(o,(e,t)=>t>=h-10,r.bottom);m.sort((e,t)=>t.count-e.count);const g=m.length>0?wa(m[0].averageRgb):u,b=ka(o,e=>e<10,r.left);b.sort((e,t)=>t.count-e.count);const v=b.length>0?wa(b[0].averageRgb):u,y=ka(o,e=>e>=d-10,r.right);y.sort((e,t)=>t.count-e.count);const _=y.length>0?wa(y[0].averageRgb):u;return{primary:u,secondary:c,width:a.naturalWidth,height:a.naturalHeight,background:{top:p,right:_,bottom:g,left:v}}});return function(t,n){return e.apply(this,arguments)}}();function $a(e,t,n){if(!e)return;let r;if("string"==typeof e&&(e=parseInt(e)),"number"==typeof e){let t;e<0?(r=new Date,t=r.getTime()+1e3*e):t=1e3*e,r=new Date(t)}else r=e;t&&r.setDate(r.getDate()+t);let a=r.getFullYear(),o=r.getMonth()+1,i=r.getHours(),s=r.getDate(),l=r.getMinutes(),u=r.getSeconds();return o<10&&(o="0"+o),s<10&&(s="0"+s),i<10&&(i="0"+i),l<10&&(l="0"+l),u<10&&(u="0"+u),"date"===n?a+"-"+o+"-"+s:"year-month"===n?a+"-"+o:e=a+"-"+o+"-"+s+" "+i+":"+l+":"+u}var Sa=$a;function Ca(e,t){return Va.apply(this,arguments)}function Va(){return(Va=p(function*(e,t){if(yield $.lib("pako.min.js"),t){e=e.substring(9);const t=pako.inflateRaw((n=atob(e),Uint8Array.from(n,function(e){return e.charCodeAt(0)})),{to:"string"});return decodeURIComponent(t).substring(9)}var n;const r=Ar(9);for(var a=pako.deflateRaw(encodeURIComponent(r+e)),o="",i=new Uint8Array(a),s=i.byteLength,l=0;l<s;l++)o+=String.fromCharCode(i[l]);return r+btoa(o)})).apply(this,arguments)}var za="_zt_",Na="_tnt_",Aa=null,Oa=dr(dr({},{huedisc:function({color:e=zen.color,count:t=6,alpha:n=.85,hueRange:r=210}){const a=oa(e),o=a.toHsl(),i=[],s=r/(t-1);for(let l=1;l<t;l++){const e=l%2==0?1:-1,t=Math.ceil(l/2)*e,r=oa({h:(o.h+t*s+360)%360,s:o.s,l:o.l});i.push(r.alpha(n).toRgbString())}return i.unshift(a.alpha(n).toRgbString()),i},sucker:xa,color:oa}),{},{idate:e=>"string"==typeof e&&e.length>12?$a(new Date(1e3*parseInt(e.substring(0,8),16))):$a(e),tenant(e){const{name:t}=zen.app;if(!Aa)try{Aa=JSON.parse(localStorage[Na])}catch(n){Aa={}}if(void 0===e)return Aa[t];e?Aa[t]=e:delete Aa[t],localStorage.setItem(Na,JSON.stringify(Aa))},fieldsData:(e,t={})=>e?(e.forEach(e=>{Er(e,t)}),t):t,sid(e){if(e)return localStorage.setItem(za,e);let t=localStorage[za];return t||(t=Ar(),this.sid(t)),t},uid:(e=8)=>Ar(e),d:e=>p(function*(){return yield Ca(e,!0)})(),e:e=>p(function*(){return yield Ca(e)})(),trim:e=>e.replace(/^\s+|\s+$/g,""),toCanvas(e){return p(function*(e,t={useCORS:!0}){return window.html2canvas||(yield $.lib("html2canvas.min.js")),new Promise((n,r)=>{html2canvas(e,t).then(e=>{n(e)}).catch(e=>r(e))})}).apply(this,arguments)},isObject(e){if(!e)return!1;const t=typeof e;return"object"===t||"function"===t},open(e,t="_blank"){let n=document.getElementById("J_linkDom");null===n&&(n=document.createElement("a"),n.setAttribute("target",t),document.body.appendChild(n)),n.setAttribute("href",e),n.click()},goto(e,t){if(t||(t={}),!e)return;let n=$.ext(),r=$.ext(e);if("html"===r||r&&n!==r)return location.href=e;if(!r&&(e+="."+n),e.indexOf("//")>-1)return location.href=e;let a=$.mergeParam(e,t);history.pushState(a,null,e)},tagName:(e,t)=>t+"-"+e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),toWebp:(e,t=1400)=>new Promise(n=>{const r=new FileReader;r.onload=function(r){const a=new Image;a.onload=function(){const r=document.createElement("canvas");let{width:o,height:i}=a;t&&o>t&&(i=Math.floor(i*(t/o)),o=t),r.width=o,r.height=i,r.getContext("2d").drawImage(a,0,0,o,i);const s="image/webp",l=r.toDataURL(s,.8).split(","),u=atob(l[1]);let c=u.length;c<200&&n(e);const d=new Uint8Array(c);for(;c--;)d[c]=u.charCodeAt(c);n(new Blob([d],{type:s}))},a.src=r.target.result},r.onerror=t=>{n(e,t)},r.readAsDataURL(e)}),fullscreen(e,t){if(!t)return e.classList.remove("z-fullscreen");e.classList.add("z-fullscreen"),e.style.zIndex=t},cookie(e,t){let n=document;if(t){t=encodeURIComponent(t);let r=new Date;r.setTime(r.getTime()+2592e6);let a=n.domain,o=e+"="+t+";path=/";return/^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(a)||(a=a.substr(a.indexOf(".")+1),o+=";domain="+a),n.cookie=o,a}let r,a=new RegExp("(^| )"+e+"=([^;]*)(;|$)");return(r=n.cookie.match(a))?decodeURIComponent(r[2]):null}});function Ea(e,t={},n,r){this.params_={},this.url=e;for(let a in t)this.put(a,t[a]);r&&this.put("path",r),this.put("event",n)}Ea.prototype={put(e,t){if(e&&void 0!==t)return this.params_[e]=encodeURIComponent(t),this},send(){var e=this;return p(function*(){let{url:t,params_:n}=e;if(t){n.sid=$.sid()||"",n.tn=$.tenant()||"",n._tzd&&delete n._tzd,n._t&&delete n._t;try{let e=[];Object.keys(n).forEach(t=>e.push(`${t}=${n[t]}`));(new Image).src=`${t}?${e.join("&")}`}catch(r){}}})()}};var Da={target:null,params:null,init(e,t){this.target=e,this.params=t},enter(e,t={}){const{target:n}=this;return new Ea(n,dr(dr({},t),this.params),"enter",e)},leave(e,t={}){const{target:n}=this;return new Ea(n,dr(dr({},t),this.params),"leave",e)},click(){const{target:e}=this,{$route:t}=zen.instance,n=t?t.path:location.pathname;return new Ea(e,this.params,"click",n)}},ja={setHash(e,t){let n=window.location.hash;if(n&&n.length>1){if(n=n.substr(1),-1===n.indexOf(e))return n+"&"+e+"="+t;let r=n.split("&"),a=0;if(1===r.length&&!r[0])return e+"="+t;for(;a<r.length;a++)if(r[a].indexOf(e+"=")>-1){r.splice(a,1);break}t&&r.push(e+"="+t),n=r.join("&")}else n=e+"="+t;window.location.hash=n},cleanHash(){window.location.hash=""},getHash(e){let t=window.location.hash;if(!t||t.length<2)return null;let n,r=t.substr(1).split("&"),a=0;for(;a<r.length;a++)if(n=r[a].split("="),n[0]===e)return n[1];return null},getParam(e,t){t||(t=window.location.href);let n=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(t);return null===n?null:decodeURIComponent(n[1].replace(/\+/g," "))},getParams(e){let t={},n=null;if(e||(e=location.search||location.hash),e.indexOf("?")>-1&&(n=e.substr(e.indexOf("?"))),!n||t.length<2)return t;n=n.substring(1).split("&");let r,a,o,i=0;for(;i<n.length;i++)r=n[i].indexOf("="),-1!==r?(a=n[i].substring(0,r),o=n[i].substring(r+1),o=decodeURIComponent(o),t[a]?t[a]+=","+o:t[a]=o):t[n[i]]=null;return t},setParam(e,t,n){if("object"==typeof t){n=e;for(let e in t)n=this.setParam(e,t[e],n);return n}n||(n=window.location.href);let r=n.indexOf("#");if(r>-1&&(n=n.substr(0,r)),n.indexOf("?")>-1){let r,a,o=n.split("?");if(-1===n.indexOf(e))return n+"&"+e+"="+t;if(r=o[0],a=o[1].split("&"),1===a.length&&!a[0])return r+"?"+e+"="+t;for(let t=0;t<a.length;t++)if(a[t].indexOf(e+"=")>-1){a.splice(t,1);break}t&&a.push(e+"="+t),n=r+"?"+a.join("&")}else n=n+"?"+e+"="+t;return n},mergeParam(e,t){let n=this.getParams(e);if(!n)return t;if(!t)return n;for(let r in t)n[r]=t[r];return n},parseURL:(e,t)=>(t||(t=window.location.href),e.indexOf("$")&&(e=e.replace(/\$([\w|_|-|\d]+)/gi,(e,n)=>{let r=$.getParam(n,t);return r||""})),e),ext(e){e||(e=window.location.pathname);let t=e.lastIndexOf(".");if(-1===t)return null;let n=e.substr(e.lastIndexOf(".")+1);return t=n.indexOf("?"),t>0?n.sub(0,t):n}},Ba="_token_";function Ta(e){return b(e).nick}function Ra(e,t){for(let n in t)e[n]=t[n]}function La(e,t){if(!e)return e;const n={};return Object.keys(e).forEach(r=>{t.includes(r)||(n[r]=e[r])}),n}function Ma(e){return void 0===e?localStorage[Ba]:e?localStorage[Ba]=e:localStorage.removeItem(Ba)}function Ia(e,t,n){const r=!!(Math.pow(2,t-1)&e);return void 0===n?r:n?r?e:e+Math.pow(2,t-1):r?e-Math.pow(2,t-1):e}function Ua(){const{href:e}=location;if(-1===e.indexOf("/auth_")&&-1===e.indexOf("/login")&&(sessionStorage._ldr_=e),zen.loginURL)return location.href=zen.loginURL;const{$router:t}=zen.instance;if(window._apps||!t)return location.href="/kooteam_/login";t.push({path:"/login"})}function Pa(e,t){t&&e.entitys.forEach((n,r)=>{t[n.name]&&(e.entitys[r]=dr(dr({},n),t[n.name]))})}function Fa(){return(Fa=p(function*(e,t={}){let n=dr(dr({},t),{},{sse:nr,ws:lr,dayjs:h.default,tracker:Da,icon:hr,omit:La,debounce:ur,throttle:Vr,token:Ma,hasTag:Ia,gotoLogin:Ua,nick:Ta,print:Cr,loadApp:$r});n.extend=Pa,n.resource=br.resource,n.lib=br.lib,n.post=(e,t)=>Gn(!0,e,t),n.get=(e,t)=>Gn(!1,e,t),Ra(n,y),Ra(n,Oa),Ra(n,ja),e.$=n;const{search:r}=window.location;if(r.indexOf("_debug_")>-1){zen.isDebug=!0;let e=$.getParams(),t=e._debug_||8080,n=e._file_||"app";setTimeout(()=>{zen.res=`http://127.0.0.1:${t}/`,$.resource(`${zen.res}${n}.js`)},50)}let a=ja.getParams();a&&(a.slientT&&Ma(a.slientT),a._platform_&&(zen.platform=a._platform_));let o=navigator.userAgent;/(MicroMessenger)/i.test(o)&&(zen.platform="weixin"),zen.platform})).apply(this,arguments)}var Za={com:(0,e.defineComponent)({props:{type:String},methods:{getCom(){return this.$refs.com}},render(){let t=zen.selfs[this.type]||(0,e.resolveComponent)($.tagName(this.type,"a"));return t?(0,e.h)(t,dr(dr({},this.$attrs),{},{ref:"com"}),this.$slots):($.error(this.type+"\u7ec4\u4ef6\u4e0d\u5b58\u5728"),null)}}),isReigster:e=>!!zen.selfs[e],reigster(e,t){e&&(zen.selfs[e]=t)}},Ha="/zen";var qa={path(e){"/"===e[0]&&(e=e.substring(1));const{hash:t,search:n}=window.location,{_tzd:r}=$.getParams(t),{env:a}=$.getParams(n);if(a&&(zen.env=a),r&&r!==$.token()&&$.token(r),e.indexOf(".")>-1){const{mode:t,app:n,res:r}=zen;return 0===t||yr()?`/${e}`:`${r}${n.name}/${n.tag}/${e}`}if(!zen.app.name)return zen.app.name=e,function(e){const t=document.getElementsByTagName("script");for(let n=0;n<t.length;n++){const r=t[n].getAttribute("src");if(!r)continue;if(r.indexOf(Ha)>-1){const e=t[n].getAttribute("value");e&&e!==$.tenant()&&$.tenant(e);const a=r.split("/");zen.app.tag=a[a.length-2],zen.lib=r.substring(0,r.indexOf(Ha)+4);continue}if(void 0===zen.lib)continue;const a="/"+e+"/",o=r.indexOf(a);if(r.indexOf("//")>-1){zen.mode=1,zen.res=r.substring(0,o+1);let e=r.substring(o+a.length);zen.app.tag=e.substring(0,e.indexOf("/"));break}const{_apps:i}=window;if(o>-1||i)return zen.mode=2,void(zen.res="/");zen.mode=0,zen.app.tag="",zen.res="/"}$.sid()||$.sid($.uid(24)),zen.res&&!zen.isDebug||(zen.res="//"+location.host+"/")}(e),zen.res}};function Ya(e,n){(0,t.showToast)({message:e,type:n,duration:3e3})}var Ja=(0,e.reactive)({}),Wa={id:null,queue:[]};var Ka={inject:{editable:{default:!1},pageData:{default:null}},props:{com:Object,data:Object,now:Number},data:()=>({meta:null,value:null,hide:!1,type:null}),created(){var e=this;return p(function*(){const{now:t,data:n,com:r}=e,{timerMode:a,timer:o}=r.meta;if(o&&t>0){if(1==a&&(t<o[0]||t>o[1]))return e.hide=!0;if(2==a&&(t>o[0]||t<o[1]))return e.hide=!0}e.meta=r.meta,e.type=`cms-${r.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}`,e.setValue(n)})()},render(){const{meta:t,value:n,hide:r,type:a,com:o}=this;return r||!t&&!n?null:this.editable?(0,e.createVNode)("div",{onClick:this.click,class:"z-com-mask"},[(0,e.createVNode)((0,e.resolveComponent)("z-com"),{type:a,"data-id":o.id,value:n,meta:t},null)]):(0,e.createVNode)((0,e.resolveComponent)("z-com"),{type:a,"data-id":o.id,value:n,meta:t},null)},methods:{loadMock(e){const t=e.split("-"),n=`${zen.res}${t[0]}/${t[1]}/config.json`;return fetch(n).then(e=>e.json()).catch(()=>{throw new Error(e+"\u7ec4\u4ef6\u4e0d\u5b58\u5728")})},setValue(e){const{now:t}=this;if(!e)return;let n;e&&e.length>0&&(e.forEach(e=>{const r=e.date;r&&t>0&&r[0]<t&&r[1]>t&&(n=e.value)}),n||(n=e[0].value)),this.value=n||{}},update(e,t){this.meta=t.meta,this.setValue(t),this.pageData&&(this.pageData[e]=t)},click(){const e=this.pageData,{type:t,update:n}=this,r=this.$route.path;$.emit("J_cmsDataForm",{page:r,type:t,pageData:e,callback:n})}}},Xa={inject:{homeData:{default:null},app:{default:null}},provide(){return{pageData:(0,e.computed)(()=>this.pageData)}},watch:{$route(){this.init()}},data:()=>({pageData:{},inited:!1,now:null,current:null,components:null}),created(){this.init()},methods:{init(){var e=this;return p(function*(){e.inited=!1;const{path:t}=e.$route;if(e.current===t)return e.inited=!0;e.current=t;const{cmsAPI:n="/api/home/page"}=window,r=yield $.post({url:n,data:{path:t}});if(!r)return $.error(t+"\u9875\u9762\u4e0d\u5b58\u5728");let{output:a,now:o,online:i}=r;-1==a.indexOf("//")&&(a=_cdn_+a),e.now=o,yield $.resource(`${a}.js`),i=i?JSON.parse(i):yield fetch(`${a}.json`).then(e=>e.json()),e.components=i.components,e.pageData=i.data,e.pageTheme(e.pageData._page_),e.inited=!0})()},pageTheme(e){if(!e)return;let t=document.getElementById("z-mini-bg")||this.$el;if(t){this.root=t;for(let n in e){let r=e[n];if(void 0!==r)switch(n){case"backgroundImage":t.style[n]=r?"url("+r+")":"none",t.style.backgroundRepeat="no-repeat",t.style.backgroundSize="100% auto";break;case"sadness":if(r){document.documentElement.style.filter="grayscale(100%)"}break;default:t.style[n]=r}}}}},render(){const{now:t=0,components:n,pageData:r}=this;return this.inited?(0,e.createVNode)("div",{class:"z-cms-page"},[n.map(n=>{const{id:a}=n;return(0,e.createVNode)(Ka,{key:a,now:t,com:n,data:r[a]},null)})]):null}},Ga={name:"zBlock",props:{url:String,href:String,params:Object,p:String,later:{type:Number,default:0},interval:{type:Number,default:0},resources:String||Array,lazy:{type:Boolean,default:!0}},setup(t){const{href:n}=t;n&&(0,e.provide)("$map",(0,e.computed)(()=>t.params))},watch:{params(){this.load()},url(){this.load()}},data:()=>({pageComponent:null,loaded:!1,visible:!1,resourceInit:!1,result:null,observer:null,laterId:null,intervalId:null}),created(){var t=this;const{resources:n,href:r,$router:a}=this;if((0,e.provide)("$block",this),r&&a){const t=a.getRoutes();for(let n=0;n<t.length;n++){const a=t[n];if(a.path===r&&a.components){this.pageComponent=(0,e.markRaw)(a.components.default);break}}return}var o;this.observer=new IntersectionObserver((o=p(function*(e){var r;e.forEach((r=p(function*(e){if(e.isIntersecting){const{target:r}=e;t.observer.unobserve(r),n&&(yield $.resource(n)),t.init(),t.visible=!0}}),function(e){return r.apply(this,arguments)}))}),function(e){return o.apply(this,arguments)}))},mounted(){const{observer:e}=this;e&&e.observe(this.$el)},unmounted(){this.laterId&&clearTimeout(this.laterId),this.intervalId&&clearInterval(this.intervalId)},render(){const{visible:t,lazy:n,loaded:r,pageComponent:a,params:o,result:i}=this;if(a)return(0,e.createVNode)("div",{class:"z-block"},[(0,e.h)(a,{params:o})]);if(!t||n&&!r)return(0,e.createVNode)("div",null,null);const s=this.$slots.default;return(0,e.createVNode)("div",{class:"z-block"},[s(i)])},methods:{init(){var e=this;return p(function*(){const{interval:t,later:n}=e;t>0?e.intervalId=setInterval(e.load,t):n>0?e.laterId=setTimeout(e.load,n):yield e.load()})()},load(){var e=this;return p(function*(){const{url:t,params:n}=e;if(!t)return e.loaded=!0,!1;try{e.result=yield $.get({data:n,url:t,context:e}),e.loaded=!0,e.$emit("finish",e.result,e.$el)}catch(r){e.$emit("fail",r)}return!0})()}}},Qa={props:{value:[Number,String],plain:Boolean,span:{type:Number}},render(){let t=this.value;if("string"==typeof t){if(!t||t.length<12)return"";t=new Date(1e3*parseInt(t.substring(0,8),16))}return t=Sa(t,this.span),(0,e.createVNode)("span",null,[t])}},eo={props:{value:String,width:{type:String,default:"160px"}},watch:{value(){this.init()}},data:()=>({qr:null}),mounted(){var e=this;return p(function*(){yield $.lib("qrcode.min.js"),e.init()})()},methods:{init(){this.qr&&(this.$el.innerHTML=""),this.qr=new QRCode(this.$el,{text:this.value})}},render(){const{width:t}=this;return(0,e.createVNode)("div",{style:{width:t,height:t},class:"z-qr"},null)}},to={inject:["$button"],props:{visible:Boolean,data:Object},data:()=>({title:null}),created(){const{$button:e}=this;this.title=e.title||e.label},methods:{submit(){var t=this;return p(function*(){const n=t.$refs.form;let r=null;if(n){if(!(yield n.validate()))return $.error("\u6570\u636e\u9a8c\u8bc1\u5931\u8d25");r=(0,e.toRaw)(n.getValues())}t.$button.post(r)})()},close(){this.$button.close()}},render(){const{data:t}=this,{fields:n,$slots:r,close:a,url:o}=this.$button,i=r.default,s=zen.color||"#ee0a24",l=$.color(s).lighten(.2).toHex();return(0,e.createVNode)((0,e.resolveComponent)("van-dialog"),{show:!0,title:this.title,"destroy-on-close":!0,"show-cancel-button":!0,theme:"round-button","confirm-button-color":s,"cancel-button-color":l,"close-on-click-overlay":!0,"show-confirm-button":!!o,"before-close":a,teleport:"body",onConfirm:this.submit},{default:()=>[(0,e.createVNode)("div",{class:"wrap"},[i&&i(t),n?(0,e.createVNode)((0,e.resolveComponent)("z-form"),{ref:"form",slots:r,data:t,fields:n},null):null])]})}};var no={inject:["$button"],props:{visible:Boolean,data:Object},data:()=>({title:null}),created(){const{$button:e}=this;this.title=e.title||e.label},methods:{submit(){var t=this;return p(function*(){const n=t.$refs.form;let r=null;if(n){if(!(yield n.validate()))return $.error("\u6570\u636e\u9a8c\u8bc1\u5931\u8d25");r=(0,e.toRaw)(n.getValues())}t.$button.post(r)})()},close(){this.$button.close()}},render(){const{data:t}=this,{fields:n,$slots:r,rightText:a,position:o,close:i}=this.$button,s=r.default;return(0,e.createVNode)((0,e.resolveComponent)("van-popup"),{show:!0,class:"z-action-popup","transition-appear":!0,teleport:"body","destroy-on-close":!0,onClose:i,position:o},{default:()=>[(0,e.createVNode)((0,e.resolveComponent)("van-nav-bar"),{title:this.title,fixed:"bottom"!==o,leftText:"\u53d6\u6d88",onClickLeft:i,onClickRight:this.submit},{right(){return a?(0,e.createVNode)((0,e.resolveComponent)("van-button"),{size:"small",type:"primary"},"function"==typeof(t=a)||"[object Object]"===Object.prototype.toString.call(t)&&!(0,e.isVNode)(t)?a:{default:()=>[a]}):null;var t}}),(0,e.createVNode)("div",{class:"wrap"},[n?(0,e.createVNode)((0,e.resolveComponent)("z-form"),{ref:"form",slots:r,data:t,fields:n},null):s(t)])]})}},ro={name:"ZAction",props:{data:Object,type:{type:String,default:"primary"},href:String,rules:Object,fields:Array,position:{type:String,default:"right"},id:String,icon:{type:String,default:null},title:String,label:String,mode:String,beforeSubmit:Function,beforeShow:Function,url:String,from:String},provide(){return{$button:this}},inject:{$table:{default:null},$block:{default:null},$form:{default:null}},data:()=>({callback:null,visible:!1,initData:null,rightText:null,com:null}),created(){let{id:e,url:t}=this;t&&!this.callback?this.callback=this.post:this.callback=this.beforeSubmit,e&&$.on(e,this.show)},unmounted(){this.id&&$.off(this.id)},methods:{close(){this.visible=!1,this.$emit("input",this.visible),this.com=null},click(e){e&&(e.preventDefault(),e.stopPropagation());const{href:t}=this;return t?$.goto(t):!this.fields&&this.url?this.post(this.data):void this.show()},show(e){var t=this;return p(function*(){const{beforeShow:n,from:r}=t;if(e||(e=t.data),t.initData=r?yield $.get({data:e,url:r}):e||{},n){const e=yield n(t.initData);e&&Object.keys(e).forEach(n=>t.initData[n]=e[n])}t.visible=!0,t.rightText=t.url||t.beforeSubmit?"\u786e\u8ba4":null,t.com="dialog"===t.mode?to:no})()},confirm(){var e=this;return p(function*(){let t=yield e.post(e.data);e.$emit("confirm",t)})()},post(e){var t=this;return p(function*(){let{url:n,beforeSubmit:r}=t;if(r){let t=yield r(e);if(!1===t)throw new Error("\u9a8c\u8bc1\u5931\u8d25");t&&(e=t)}if(t.$emit("change",e),!n)return t.reload();let a=yield $.post({data:e,url:n},t);return t.$emit("finish",a,e),t.reload(),a})()},reload(){var e=this;return p(function*(){const{$block:t,$table:n}=e;if(e.close(),!t||!(yield t.load()))return n?n.refresh():void 0})()}},render(){let{$attrs:t,com:n,visible:r,title:a,click:o,fields:i,$slots:s,label:l}=this;if(a&&!i&&!s.default)return(0,e.createVNode)((0,e.resolveComponent)("van-action-sheet"),{show:r,"onUpdate:show":e=>r=e,actions:[{name:a}],"cancel-text":"\u53d6\u6d88","close-on-click-action":!0,onCancel:this.close},null);const u=n?(0,e.h)(n,{visible:r,data:this.initData}):null;if("bubble"===this.type)return(0,e.createVNode)((0,e.resolveComponent)("van-floating-bubble"),(0,e.mergeProps)({axis:"xy",gap:48},t,{onClick:o,teleport:"body"}),{default:()=>[l,u]});const c=s.label;return c?(0,e.createVNode)("span",(0,e.mergeProps)(t,{type:this.type,onClick:o}),[c(),u]):l?(0,e.createVNode)((0,e.resolveComponent)("van-button"),(0,e.mergeProps)(t,{type:this.type,onClick:o}),{default:()=>[l,u]}):(0,e.createVNode)((0,e.resolveComponent)("van-cell"),(0,e.mergeProps)(t,{title:a,onClick:o,"right-icon":this.icon,"is-link":!0}),{extra:()=>u})}},ao=(e,t)=>{const n=e.__vccOpts||e;for(const[r,a]of t)n[r]=a;return n};var oo=ao({props:{href:String},setup(t){const n=(0,e.ref)(0);let r=null;return{click:()=>{if(n.value++,null===r&&(r=setTimeout(()=>{n.value=0,clearTimeout(r),r=null},3e3)),n.value>9){sessionStorage._cl_="sly";const{href:e}=t;e?$.open(e):location.reload()}}}}},[["render",function(t,n,r,a,o,i){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{onClick:n[0]||(n[0]=(...e)=>a.click&&a.click(...e))},[(0,e.renderSlot)(t.$slots,"default")])}]]),io=u((e,t)=>{var n,r;n=e,r=function(){return function(){var e={686:function(e,t,n){"use strict";n.d(t,{default:function(){return _}});var r=n(279),a=n.n(r),o=n(370),i=n.n(o),s=n(817),l=n.n(s);function u(e){try{return document.execCommand(e)}catch(t){return!1}}var c=function(e){var t=l()(e);return u("cut"),t},d=function(e,t){var n=function(e){var t="rtl"===document.documentElement.getAttribute("dir"),n=document.createElement("textarea");n.style.fontSize="12pt",n.style.border="0",n.style.padding="0",n.style.margin="0",n.style.position="absolute",n.style[t?"right":"left"]="-9999px";var r=window.pageYOffset||document.documentElement.scrollTop;return n.style.top="".concat(r,"px"),n.setAttribute("readonly",""),n.value=e,n}(e);t.container.appendChild(n);var r=l()(n);return u("copy"),n.remove(),r},h=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body},n="";return"string"==typeof e?n=d(e,t):e instanceof HTMLInputElement&&!["text","search","url","tel","password"].includes(null==e?void 0:e.type)?n=d(e.value,t):(n=l()(e),u("copy")),n};function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var n,r,a,o=v(e);if(t){var i=v(this).constructor;n=Reflect.construct(o,arguments,i)}else n=o.apply(this,arguments);return r=this,!(a=n)||"object"!==p(a)&&"function"!=typeof a?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(r):a}}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,t){var n="data-clipboard-".concat(e);if(t.hasAttribute(n))return t.getAttribute(n)}var _=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(o,e);var t,n,r,a=b(o);function o(e,t){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),(n=a.call(this)).resolveOptions(t),n.listenClick(e),n}return t=o,n=[{key:"resolveOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText,this.container="object"===p(e.container)?e.container:document.body}},{key:"listenClick",value:function(e){var t=this;this.listener=i()(e,"click",function(e){return t.onClick(e)})}},{key:"onClick",value:function(e){var t=e.delegateTarget||e.currentTarget,n=this.action(t)||"copy",r=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.action,n=void 0===t?"copy":t,r=e.container,a=e.target,o=e.text;if("copy"!==n&&"cut"!==n)throw new Error('Invalid "action" value, use either "copy" or "cut"');if(void 0!==a){if(!a||"object"!==f(a)||1!==a.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===n&&a.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===n&&(a.hasAttribute("readonly")||a.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')}return o?h(o,{container:r}):a?"cut"===n?c(a):h(a,{container:r}):void 0}({action:n,container:this.container,target:this.target(t),text:this.text(t)});this.emit(r?"success":"error",{action:n,text:r,trigger:t,clearSelection:function(){t&&t.focus(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(e){return y("action",e)}},{key:"defaultTarget",value:function(e){var t=y("target",e);if(t)return document.querySelector(t)}},{key:"defaultText",value:function(e){return y("text",e)}},{key:"destroy",value:function(){this.listener.destroy()}}],r=[{key:"copy",value:function(e){return h(e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body})}},{key:"cut",value:function(e){return c(e)}},{key:"isSupported",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],t="string"==typeof e?[e]:e,n=!!document.queryCommandSupported;return t.forEach(function(e){n=n&&!!document.queryCommandSupported(e)}),n}}],n&&m(t.prototype,n),r&&m(t,r),o}(a())},828:function(e){if("undefined"!=typeof Element&&!Element.prototype.matches){var t=Element.prototype;t.matches=t.matchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector}e.exports=function(e,t){for(;e&&9!==e.nodeType;){if("function"==typeof e.matches&&e.matches(t))return e;e=e.parentNode}}},438:function(e,t,n){var r=n(828);function a(e,t,n,r,a){var i=o.apply(this,arguments);return e.addEventListener(n,i,a),{destroy:function(){e.removeEventListener(n,i,a)}}}function o(e,t,n,a){return function(n){n.delegateTarget=r(n.target,t),n.delegateTarget&&a.call(e,n)}}e.exports=function(e,t,n,r,o){return"function"==typeof e.addEventListener?a.apply(null,arguments):"function"==typeof n?a.bind(null,document).apply(null,arguments):("string"==typeof e&&(e=document.querySelectorAll(e)),Array.prototype.map.call(e,function(e){return a(e,t,n,r,o)}))}},879:function(e,t){t.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},t.nodeList=function(e){var n=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===n||"[object HTMLCollection]"===n)&&"length"in e&&(0===e.length||t.node(e[0]))},t.string=function(e){return"string"==typeof e||e instanceof String},t.fn=function(e){return"[object Function]"===Object.prototype.toString.call(e)}},370:function(e,t,n){var r=n(879),a=n(438);e.exports=function(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!r.string(t))throw new TypeError("Second argument must be a String");if(!r.fn(n))throw new TypeError("Third argument must be a Function");if(r.node(e))return function(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}(e,t,n);if(r.nodeList(e))return function(e,t,n){return Array.prototype.forEach.call(e,function(e){e.addEventListener(t,n)}),{destroy:function(){Array.prototype.forEach.call(e,function(e){e.removeEventListener(t,n)})}}}(e,t,n);if(r.string(e))return function(e,t,n){return a(document.body,e,t,n)}(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},817:function(e){e.exports=function(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var r=window.getSelection(),a=document.createRange();a.selectNodeContents(e),r.removeAllRanges(),r.addRange(a),t=r.toString()}return t}},279:function(e){function t(){}t.prototype={on:function(e,t,n){var r=this.e||(this.e={});return(r[e]||(r[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){var r=this;function a(){r.off(e,a),t.apply(n,arguments)}return a._=t,this.on(e,a,n)},emit:function(e){for(var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),r=0,a=n.length;r<a;r++)n[r].fn.apply(n[r].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),r=n[e],a=[];if(r&&t)for(var o=0,i=r.length;o<i;o++)r[o].fn!==t&&r[o].fn._!==t&&a.push(r[o]);return a.length?n[e]=a:delete n[e],this}},e.exports=t,e.exports.TinyEmitter=t}},t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}return n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n(686)}().default},"object"==typeof e&&"object"==typeof t?t.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof e?e.ClipboardJS=r():n.ClipboardJS=r()}),so=c(io());var lo={props:{label:String,type:String,value:[String,Number,Object]},render(){let{label:t,type:n,$slots:r,value:a}=this;if(t||void 0===a||("object"==typeof a?a=JSON.stringify(a):a+="",t=a.length>12?a.substring(0,12):a),n)return(0,e.createVNode)((0,e.resolveComponent)("van-button"),{type:n},"function"==typeof(o=t)||"[object Object]"===Object.prototype.toString.call(o)&&!(0,e.isVNode)(o)?t:{default:()=>[t]});var o;const i=r.default;return i?(0,e.createVNode)("div",{class:"z-copy"},[(0,e.createTextVNode)(" "),i()]):(0,e.createVNode)("div",{class:"z-copy"},[t])},mounted(){new so.default(this.$el,{text:()=>{const{value:e}=this;return e?"object"==typeof e?JSON.stringify(e,null,2):e+"":this.value||this.label}}).on("success",()=>{$.success("\u590d\u5236\u6210\u529f")})}};var uo=ao({props:{items:Array,modelValue:{type:Array,default:function(){return[]}}},data:()=>({selected:[]}),created(){const{modelValue:e}=this;e&&(this.selected=e)},methods:{change(){this.$emit("update:modelValue",this.selected)}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-checkbox"),l=(0,e.resolveComponent)("van-checkbox-group");return(0,e.openBlock)(),(0,e.createBlock)(l,{shape:"square",modelValue:o.selected,"onUpdate:modelValue":n[0]||(n[0]=e=>o.selected=e),onChange:i.change},{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(r.items,t=>((0,e.openBlock)(),(0,e.createBlock)(s,{key:t.key,name:t.value},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(t.label),1)]),_:2},1032,["name"]))),128))]),_:1},8,["modelValue","onChange"])}]]);var co=ao({props:{items:Array}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-radio"),l=(0,e.resolveComponent)("van-radio-group");return(0,e.openBlock)(),(0,e.createBlock)(l,(0,e.normalizeProps)((0,e.guardReactiveProps)(t.$attrs)),{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(r.items,t=>((0,e.openBlock)(),(0,e.createBlock)(s,{key:t.key,name:t.value},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(t.label),1)]),_:2},1032,["name"]))),128))]),_:1},16)}]]);var ho=ao({props:{items:Array,multiple:Boolean,modelValue:Number||String||Array},computed:{columns(){return this.items.map(({label:e,value:t})=>({text:e,value:t}))},showValue(){const{modelValue:e,items:t}=this;for(let n=0;n<t.length;n++)if(t[n].value===e)return t[n].label;return"\u8bf7\u9009\u62e9"}},data:()=>({visible:!1,selected:[]}),created(){const{modelValue:e}=this;e&&(this.selected=this.multiple?e:[e])},methods:{hide(){this.visible=!1},change(){const{selected:e}=this;this.multiple?this.$emit("update:modelValue",e):this.$emit("update:modelValue",e.length>0?e[0]:null),this.hide()}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-picker"),l=(0,e.resolveComponent)("van-popup");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("span",{onClick:n[0]||(n[0]=e=>o.visible=!0)},(0,e.toDisplayString)(i.showValue),1),(0,e.createVNode)(l,{show:o.visible,"onUpdate:show":n[2]||(n[2]=e=>o.visible=e),teleport:"body",round:"",position:"bottom"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(s,{modelValue:o.selected,"onUpdate:modelValue":n[1]||(n[1]=e=>o.selected=e),columns:i.columns,onCancel:i.hide,onConfirm:i.change},null,8,["modelValue","columns","onCancel","onConfirm"])]),_:1},8,["show"])],64)}]]),fo={props:{items:Array,modelValue:[String,Number,Array]},render(){let{modelValue:t,items:n}=this;if(Array.isArray(t)){let r=[];for(let e=0;e<n.length;e++)t.forEach(t=>{n[e].value===t&&r.push(n[e].label)});return(0,e.createVNode)("span",null,[r.join("\uff0c")])}for(let r=0;r<n.length;r++)if(n[r].value===t){const t={};return n[r].color&&(t.color=n[r].color),(0,e.createVNode)("span",{style:t},[n[r].label])}return"-"}},po={name:"Dict",inject:{$form:{default:{}},$dict:{default:null}},props:{code:{type:String},label:String,type:{type:String,default:"select"},rules:Array,name:String,readonly:Boolean,modelValue:[String,Array,Number],default:[String,Array,Number,Object],multiple:{type:Boolean,default:!1}},computed:{isSearch(){const{$form:e}=this;return e&&e.limit>0}},data:()=>({items:[],showType:null}),created(){let{modelValue:e,code:t}=this;this.items=this.$dict(t).v,void 0===e&&this.$emit("update:modelValue",this.multiple?[]:null)},render(){let{type:t,label:n,name:r,$attrs:a,items:o,modelValue:i,multiple:s}=this;if(!o)return null;const l=this.getCom(t);if("text"===t||!r)return n?(0,e.createVNode)((0,e.resolveComponent)("van-cell"),{title:n},{value:()=>(0,e.createVNode)(fo,{modelValue:i,items:o},null)}):(0,e.createVNode)(fo,{modelValue:i,items:o},null);const u=(0,e.h)(l,dr(dr({},a),{},{modelValue:i,multiple:s,"onUpdate:modelValue":this.change,items:o}));return n?(0,e.createVNode)((0,e.resolveComponent)("van-field"),{"input-align":"right",label:n,name:r},{input:()=>u}):u},methods:{getCom(e){return this.isSearch?ho:"checkbox"===e?uo:this.multiple?ho:"radiobox"===e?co:ho},change(e){this.input(e);let{$form:t}=this;t.limit>0&&t.change()},input(e){this.$emit("update:modelValue",e),this.$emit("change",e)}}};function mo(e,t){if(t){for(let n=0;n<t.length;n++)if(t[n].name===e)return t[n];return null}}var go=function e(t=[],n){return t.map(t=>{if(t.children){const r=e(t.children,n);return dr(dr({},t),{},{children:r})}if("string"==typeof t){const e=mo(t,n);return e||{name:t}}{const e=mo(t.name,n);return e?dr(dr({},e),t):t}})},bo={inheritAttrs:!1,name:"zForm",inject:{$table:{default:null},$button:{default:null},configs:{default:null}},props:{fields:Array,data:Object,rules:Object,slots:Array,url:String,beforeSubmit:Function},provide(){return{$form:this}},data:()=>({formData:null,fieldItems:[],submitable:!1}),created(){var e=this;return p(function*(){e.submitable=!(!e.url&&!e.beforeSubmit);const{$table:t,configs:n,fields:r}=e;n?e.fieldItems=go(r,t?t.configs.entitys||t.columns:n.entitys):r&&(e.fieldItems=r);const{data:a={}}=e;e.formData=$.fieldsData(e.fieldItems,a)})()},methods:{validate(){var e=this;return p(function*(){const t=e.$refs.form;if(!t)return!0;yield t.validate();const n=t.getValidationStatus(),r=Object.keys(n);for(let e=0;e<r.length;e++)if("failed"===n[r[e]])return!1;return!0})()},getValues(){return this.formData},keyup(e){13===e.keycode&&this.submit(e)},close(){let{$button:e}=this;e&&e.close()},update(){},submit(){var e=this;return p(function*(){if(!e.validate())return;let{beforeSubmit:t,formData:n,$button:r,$table:a,url:o}=e;if(t){let e=yield t(n);if(!1===e||!o)return;e&&"object"==typeof e&&(n=e)}const i=yield $.post({data:n,url:o},e);if(a&&a.refresh(),r)return r.$emit("finish",i,n),r.close();e.$emit("finish",i,n),e.reset()})()},reset(){this.$refs.form.resetValidation()}},render(){let{$slots:t,rules:n,$button:r,$attrs:a,formData:o,submitable:i,fieldItems:s,submit:l}=this;const u=this.slots||t;let c=u.action$,d=null;return r&&i&&(c=u.action$,d=(0,e.createVNode)("div",{class:"z-form-action"},[c?c(o):(0,e.createVNode)((0,e.resolveComponent)("van-button"),{block:!0,round:!0,"native-type":"submit",type:"primary"},{default:()=>[(0,e.createTextVNode)("\u786e\u5b9a")]})])),(i||c)&&(d=(0,e.createVNode)("div",{class:"z-form-action"},[i?(0,e.createVNode)((0,e.resolveComponent)("van-button"),{block:!0,round:!0,"native-type":"submit",type:"primary"},{default:()=>[(0,e.createTextVNode)("\u786e\u5b9a")]}):null,c?c(o):null])),(0,e.createVNode)((0,e.resolveComponent)("van-form"),(0,e.mergeProps)(a,{"input-align":"right",rules:n,ref:"form",onSubmit:l}),{default:()=>[(0,e.createVNode)((0,e.resolveComponent)("z-form-items"),{inited:!0,value:o,fields:s},null),t.default&&t.default(o),d]})}};function vo(e,t){return e?t?dr(dr({},e),t):e||{}:t||{}}var yo=["table","list","checkbox","image"];var _o=function e(t,n,r=[]){let a,{name:o,multiple:i,children:s}=t;if(!o)return;const l=[...r,o];let u=l.length-1;for(let c=0;c<=u&&(a=l[c],void 0===n[a]);c++)c===u&&(void 0!==t.default?n[a]=t.default:s?(n[a]={},s.forEach(t=>e(t,n[a],l))):n[a]=i||yo.includes(t.type)?[]:null)},wo="_user_",ko={inject:{$form:{default:null}},inheritAttrs:!1,props:{name:String,label:String,value:Object,modelValue:[String,Number,Array],placeholder:{type:String,default:"\u8bf7\u8f93\u5165\u5173\u952e\u5b57\u641c\u7d22\u7528\u6237"},limit:{type:Number,default:1},readonly:Boolean},data:()=>({loading:!1,visible:!1,fields:{text:"nick",value:"id"},keyword:null,selected:[],options:[],latest:[]}),methods:{hide(){this.visible=!1},show(){this.visible=!0},open(){const e=localStorage[wo];if(e){const t=JSON.parse(e);this.options=t.map(e=>b(e)),this.latest=t}this.options.length<3&&this.remote()},confirm({selectedValues:e}){let{limit:t,latest:n}=this;const r=e;this.selected=r;const a=t>1?r:r[0];this.$emit("update:modelValue",a),r.forEach(e=>{!n.includes(e)&&n.unshift(e)}),n.length>5&&n.splice(5),this.latest=n,localStorage[wo]=JSON.stringify(n),this.hide()},remove(){let{selected:e,multiple:t}=this;e.splice(0,1),this.selected=e;const n=t?e:null;this.$emit("update",n)},remote(){var e=this;return p(function*(){if(e.loading)return;e.loading=!0;const{keyword:t}=e;let n={page:0,pageSize:6};t&&(n.keyword=t);try{e.options=yield $.get({data:n,url:"/api/zen/nick",context:e})}catch(r){}finally{e.loading=!1}})()}}},xo={key:1};var $o=ao(ko,[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("z-avatar"),l=(0,e.resolveComponent)("van-field"),u=(0,e.resolveComponent)("van-search"),c=(0,e.resolveComponent)("van-picker"),d=(0,e.resolveComponent)("van-popup");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createVNode)(l,{name:r.name,"is-link":"",readonly:"",rules:t.rules,label:r.label,onClick:i.show},{"right-icon":(0,e.withCtx)(()=>[r.modelValue?((0,e.openBlock)(),(0,e.createBlock)(s,{key:0,plain:!1,value:r.modelValue},null,8,["value"])):((0,e.openBlock)(),(0,e.createElementBlock)("span",xo,"\u8bf7\u9009\u62e9"))]),_:1},8,["name","rules","label","onClick"]),(0,e.createVNode)(d,{show:o.visible,"onUpdate:show":n[1]||(n[1]=e=>o.visible=e),onOpen:i.open,teleport:"body",position:"bottom"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(c,{title:"\u9009\u62e9\u7528\u6237","columns-field-names":o.fields,onConfirm:i.confirm,onCancel:i.hide,columns:o.options},{"columns-top":(0,e.withCtx)(()=>[(0,e.createVNode)(u,{modelValue:o.keyword,"onUpdate:modelValue":n[0]||(n[0]=e=>o.keyword=e),onSearch:i.remote,"input-align":"left",placeholder:r.placeholder},null,8,["modelValue","onSearch","placeholder"])]),_:1},8,["columns-field-names","onConfirm","onCancel","columns"])]),_:1},8,["show","onOpen"])],64)}]]),So=function(e,t,n="1"){for(let r in e)if(e[r][1]===n){let n={label:e[r][0],value:r};const a=So(e,[],n.value);a.length>0&&(n.children=a),t.push(n)}return t};var Co=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,rules:[Array,Object]},data:()=>({visible:!1,showValue:null,options:null,preload:!1,cascaderValue:null,fieldNames:{text:"label"}}),created(){const{formData:e,name:t}=this,n=e[t];n&&(this.cascaderValue=n,this.showValue=n.map(e=>e.label).join("\uff0c"))},methods:{close(){this.visible=!1},show(){var e=this;return p(function*(){e.preload||(e.visible=!0,e.options||(e.preload=!0,yield $.lib("address.js"),e.options=So(window.tdist,[])),e.preload=!1)})()},change({selectedOptions:e}){this.showValue=e.map(e=>e.label).join("\uff0c");const t=e.map(({label:e,value:t})=>({label:e,value:t}));this.$emit("update:modelValue",t),this.visible=!1}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field"),l=(0,e.resolveComponent)("van-loading"),u=(0,e.resolveComponent)("van-cascader"),c=(0,e.resolveComponent)("van-popup");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createVNode)(s,{name:r.name,"is-link":"",readonly:"",rules:r.rules,label:r.label,onClick:i.show},{"right-icon":(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(o.showValue),1)]),_:1},8,["name","rules","label","onClick"]),(0,e.createVNode)(c,{show:o.visible,"onUpdate:show":n[1]||(n[1]=e=>o.visible=e),teleport:"body",position:"bottom"},{default:(0,e.withCtx)(()=>[o.preload?((0,e.openBlock)(),(0,e.createBlock)(l,{key:0,style:{margin:"140px 0"},type:"spinner",size:"24px",vertical:""},{default:(0,e.withCtx)(()=>[...n[2]||(n[2]=[(0,e.createTextVNode)("\u5730\u5740\u52a0\u8f7d\u4e2d...",-1)])]),_:1})):((0,e.openBlock)(),(0,e.createBlock)(u,{key:1,modelValue:o.cascaderValue,"onUpdate:modelValue":n[0]||(n[0]=e=>o.cascaderValue=e),"field-names":o.fieldNames,title:"\u8bf7\u9009\u62e9\u6240\u5728\u5730\u533a",options:o.options,onClose:i.close,onFinish:i.change},null,8,["modelValue","field-names","options","onClose","onFinish"]))]),_:1},8,["show"])],64)}]]),Vo={key:0,class:"z-uploader-item"};var zo=ao({inheritAttrs:!1,props:{label:String,name:String,modelValue:[Object,Array],value:Object,limit:{type:Number,default:1}},methods:{before(e){var t=this;return p(function*(){const{name:n}=e,r=yield $.get({url:"/kooteam/api/zen/pair",data:{fileName:n}});return yield fetch(r.target,{method:r.method,body:e,headers:r.headers||{}}),t.fileName=n,t.$emit("update:modelValue",{path:r.path,name:n}),!1})()},clear(){this.$emit("update:modelValue",null)}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-icon"),l=(0,e.resolveComponent)("van-button"),u=(0,e.resolveComponent)("van-uploader"),c=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(c,{name:r.name,label:r.label,rules:t.rules},{input:(0,e.withCtx)(()=>[r.modelValue?((0,e.openBlock)(),(0,e.createElementBlock)("div",Vo,[(0,e.createVNode)(s,{name:"delete-o",onClick:i.clear},null,8,["onClick"]),(0,e.createTextVNode)(" "+(0,e.toDisplayString)(r.modelValue.name),1)])):(0,e.createCommentVNode)("",!0),(0,e.createVNode)(u,{"max-count":r.limit,"before-read":i.before,multiple:r.limit>1},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(l,{icon:"link-o",size:"small"},{default:(0,e.withCtx)(()=>[...n[0]||(n[0]=[(0,e.createTextVNode)("\u9009\u62e9\u6587\u4ef6",-1)])]),_:1})]),_:1},8,["max-count","before-read","multiple"])]),_:1},8,["name","label","rules"])}]]);var No=ao({inheritAttrs:!1,props:{label:String,rules:[Array,Object],name:String,formData:Object,options:Array}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-checkbox"),l=(0,e.resolveComponent)("van-checkbox-group"),u=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(u,{label:r.label,rules:r.rules,name:r.name},{input:(0,e.withCtx)(()=>[r.options?((0,e.openBlock)(),(0,e.createBlock)(l,(0,e.mergeProps)({key:0,direction:2===r.options.length?"horizontal":"vertical"},t.$attrs),{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(r.options,(t,n)=>((0,e.openBlock)(),(0,e.createBlock)(s,{key:n,name:t.value},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(t.label),1)]),_:2},1032,["name"]))),128))]),_:1},16,["direction"])):(0,e.createCommentVNode)("",!0)]),_:1},8,["label","rules","name"])}]]),Ao=c(d());var Oo=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,rules:[Array,Object]},data:()=>({visible:!1,showValue:null}),created(){const{formData:e,name:t}=this,n=e[t];n&&(this.showValue=Ao.default.unix(n).format("YYYY-MM-DD hh:mm:ss"))},methods:{change({selectedValues:e}){this.showValue=e.join("-");const t=(0,Ao.default)(new Date(this.showValue)).unix();this.$emit("update:modelValue",t),this.visible=!1}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field"),l=(0,e.resolveComponent)("van-date-picker"),u=(0,e.resolveComponent)("van-popup");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createVNode)(s,{name:r.name,"is-link":"",readonly:"",rules:r.rules,label:r.label,onClick:n[0]||(n[0]=e=>o.visible=!0)},{"right-icon":(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(o.showValue),1)]),_:1},8,["name","rules","label"]),(0,e.createVNode)(u,{show:o.visible,"onUpdate:show":n[2]||(n[2]=e=>o.visible=e),teleport:"body",position:"bottom"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(l,{onConfirm:i.change,onCancel:n[1]||(n[1]=e=>o.visible=!1)},null,8,["onConfirm"])]),_:1},8,["show"])],64)}]]),Eo=c(d()),Do="YYYY-MM-DD";var jo=ao({inheritAttrs:!1,data:()=>({visible:!1,def:[],showValue:null}),props:{name:String,formData:Object,label:String,rules:[Array,Object]},created(){const{$attrs:e,name:t,formData:n}=this,{startKey:r=t+"Start",endKey:a=t+"End"}=e;if(!n[r])return"";const o=Eo.default.unix(n[r]),i=Eo.default.unix(n[a]);this.def[i],this.showValue=`${o.format(Do)} \u81f3 ${i.format(Do)}`},methods:{update(e,t,n){n&&2===n.length?(this.formData[e]=(0,Eo.default)(n[0]).unix(),this.formData[t]=(0,Eo.default)(n[1]).unix()):(this.formData[e]=null,this.formData[t]=null)},change(e){const{$attrs:t,name:n}=this;if(n)this.formData[n]=e,this.update(n+"Start",n+"End",e);else{const{startKey:n,endKey:r}=t;this.update(n,r,e)}this.$emit("update:modelValue",e),this.showValue=`${(0,Eo.default)(e[0]).format(Do)} \u81f3 ${(0,Eo.default)(e[1]).format(Do)}`,this.visible=!1}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field"),l=(0,e.resolveComponent)("van-calendar");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createVNode)(s,{"is-link":"",readonly:"",name:r.name,rules:r.rules,label:r.label,onClick:n[0]||(n[0]=e=>o.visible=!0)},{"right-icon":(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(o.showValue),1)]),_:1},8,["name","rules","label"]),(0,e.createVNode)(l,{show:o.visible,"onUpdate:show":n[1]||(n[1]=e=>o.visible=e),"default-date":o.def,type:"range",onConfirm:i.change},null,8,["show","default-date","onConfirm"])],64)}]]),Bo={inheritAttrs:!1,props:{name:String,formData:Object,maxWidth:{type:Number,default:1e3},mode:{type:String,default:"public"},native:{type:Boolean,default:!1},limit:{type:Number,default:6},label:String,data:{type:Object,default:function(){return{}}},rules:[Array,Object]},computed:{multiple(){return this.limit>1}},data:()=>({readonly:!1,fileList:[]}),created(){const{formData:e,name:t}=this;if(e&&e[t]){const n=e[t];Array.isArray(n)?this.fileList=n.map(e=>"string"==typeof e?{url:e,isImage:!0}:e):this.fileList=[{url:n,isImage:!0}]}},methods:{click(e){var t=this;if(!this.readonly)return;e.preventDefault();const{wx:n}=window;return!n||($.wxApi(["chooseImage","uploadImage"],{count:this.limit,sizeType:["compressed"],sourceType:["album","camera"],success:(r=p(function*({localIds:e}){for(let n=0;n<e.length;n++)yield t.wxUpload(e[n])}),function(e){return r.apply(this,arguments)})}),!1);var r},wxUpload(e){var t=this;const{data:n}=this;return new Promise((r,a)=>{var o;wx.uploadImage({localId:e,fail:a,success:(o=p(function*({serverId:e}){const a=yield $.get({url:"/api/home/wxFile",data:dr(dr({},n),{},{serverId:e})});t.update({url:a}),r()}),function(e){return o.apply(this,arguments)})})})},afterRead({file:e}){var t=this;return p(function*(){const n=yield $.toWebp(e,t.maxWidth),r=dr(dr({},t.data),{},{public:t.mode}),a=yield $.post({url:"/kooteam/api/zen/pair",file:n,data:r});t.update(a)})()},del({detail:e}){this.fileList.splice(e.index,1),this.$emit("update:modelValue",this.fileList)},update(e){const t=dr(dr({},e),{},{isImage:!0});this.multiple?(this.fileList.push(t),this.$emit("update:modelValue",this.fileList)):(this.fileList=[t],this.$emit("update:modelValue",t.url))}}};var To=ao(Bo,[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-uploader"),l=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(l,{name:r.name,label:r.label,rules:r.rules},{input:(0,e.withCtx)(()=>[(0,e.createVNode)(s,{"max-count":r.limit,onDelete:i.del,modelValue:o.fileList,readonly:o.readonly,"after-read":i.afterRead,reupload:"",multiple:i.multiple},null,8,["max-count","onDelete","modelValue","readonly","after-read","multiple"])]),_:1},8,["name","label","rules"])}]]);var Ro=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,scannable:Boolean,isDebug:Boolean,rules:[Array,Object]},methods:{scan(){var e=this;return p(function*(){const t=yield $.scan(["qrCode","barCode"],e.isDebug);e.$emit("update:modelValue",t)})()}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-button"),l=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(l,(0,e.mergeProps)({name:r.name},t.$attrs,{label:r.label,rules:r.rules}),{button:(0,e.withCtx)(()=>[r.scannable?((0,e.openBlock)(),(0,e.createBlock)(s,{key:0,icon:"scan",plain:"",type:"primary",size:"small",onClick:i.scan},null,8,["onClick"])):(0,e.createCommentVNode)("",!0)]),_:1},16,["name","label","rules"])}]]),Lo={props:{modelValue:[String,Number]},render(){const{modelValue:t}=this;let n=(Math.floor(t)/100).toString().split(".");const r=`${n[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g,",");if(null===r)return null;const a=n.length>1?n[1]:"00";return(0,e.createVNode)("span",{class:"z-money"},[(0,e.createVNode)("i",null,[(0,e.createTextVNode)("\xa5")]),(0,e.createVNode)("span",null,[r,(0,e.createTextVNode)(".")]),(0,e.createVNode)("em",null,[a])])}},Mo={inheritAttrs:!1,props:{name:String,formData:Object,label:String,modelValue:[Number,String],readonly:{type:Boolean,default:!1}},data:()=>({visible:!1,showValue:""}),created(){const{modelValue:e}=this;e&&this.formatter(e)},methods:{show(){this.visible=!0},update(e){this.showValue=e},hide(){this.visible=!1},blur(){const e=this.showValue,t=Math.floor(100*e);let n=(t/100).toString().split(".");const r=`${n[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g,",");n.length>1?this.showValue=r+"."+n[1]:this.showValue=r,this.$emit("update:modelValue",t),this.hide()}},render(){return this.readonly?(0,e.createVNode)(Lo,{modelValue:this.modelValue},null):(0,e.createVNode)(e.Fragment,null,[(0,e.createVNode)((0,e.resolveComponent)("van-field"),{label:this.label,modelValue:this.showValue,readonly:!0,clearable:!0,clickable:!0,onClick:this.show},null),(0,e.createVNode)((0,e.resolveComponent)("van-number-keyboard"),{show:this.visible,modelValue:this.showValue,"onUpdate:modelValue":this.update,theme:"custom","z-index":3e3,"extra-key":".",teleport:"body","close-button-text":"\u5b8c\u6210",onClose:this.hide,onBlur:this.blur},null)])}},Io={inheritAttrs:!1,props:{name:String,formData:Object,label:String,integer:{type:Boolean,default:!0},modelValue:[Number,String],readonly:{type:Boolean,default:!1}},data:()=>({visible:!1,inputValue:""}),created(){this.modelValue&&(this.inputValue=this.modelValue)},methods:{hide(){this.visible=!1},show(e){const{classList:t}=e.target;t.contains("van-stepper__input")&&(this.visible=!0)},input(e){this.inputValue=e,this.$emit("update:modelValue",e)}},render(){const{inputValue:t}=this;return(0,e.createVNode)(e.Fragment,null,[(0,e.createVNode)((0,e.resolveComponent)("van-field"),{label:this.label,modelValue:t,readonly:!0,clickable:!0,clearable:!0},{input:()=>(0,e.createVNode)((0,e.resolveComponent)("van-stepper"),(0,e.mergeProps)({"disable-input":!0,min:0},this.$attrs,{onClick:this.show,"input-width":"90px",modelValue:t,"update:modelValue":this.input}),null)}),(0,e.createVNode)((0,e.resolveComponent)("van-number-keyboard"),{show:this.visible,modelValue:t,"onUpdate:modelValue":this.input,theme:"custom","z-index":3e3,"extra-key":this.integer?"":".",teleport:"body","close-button-text":"\u5b8c\u6210",onBlur:this.hide},null)])}};var Uo=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,rules:[Array,Object]}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(s,(0,e.mergeProps)(t.$attrs,{name:r.name,type:"password",label:r.label,rules:r.rules}),null,16,["name","label","rules"])}]]);var Po=ao({inheritAttrs:!1,props:{label:String,rules:[Array,Object],name:String,formData:Object,options:Array}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-radio"),l=(0,e.resolveComponent)("van-radio-group"),u=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(u,{label:r.label,rules:r.rules,name:r.name},{input:(0,e.withCtx)(()=>[(0,e.createVNode)(l,(0,e.mergeProps)({direction:2===r.options.length?"horizontal":"vertical"},t.$attrs),{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(r.options,(t,n)=>((0,e.openBlock)(),(0,e.createBlock)(s,{key:n,name:t.value},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(t.label),1)]),_:2},1032,["name"]))),128))]),_:1},16,["direction"])]),_:1},8,["label","rules","name"])}]]),Fo={},Zo={};var Ho=function(t,n){Fo[n]||(Fo[n]=(0,e.reactive)({}));let r=Zo[n];var a;return r||(r={queue:[],id:null,depend:n},Zo[n]=r),Fo[n][t]||(Fo[n][t]={id:t,title:null},r.queue.includes(t)||r.queue.push(t)),null===r.id&&r.queue.length>0&&(r.id=setTimeout((a=p(function*(e){const t=yield $.get({data:{list:e.queue,depend:e.depend},url:"/api/zen/search"});t&&t.forEach(e=>{Fo[n][e.id].title=e.title}),clearTimeout(e.id),e.queue=[],e.id=null}),function(e){return a.apply(this,arguments)}),60,r)),Fo[n][t]},qo={inheritAttrs:!1,props:{name:String,rules:[Array,Object],modelValue:[String,Array],label:String,depend:String,tenant:String,readonly:{type:Boolean,default:!1}},data:()=>({visible:!1,showValue:null,selected:[],columns:[]}),created(){var e=this;return p(function*(){yield e.initSelected();const{modelValue:t}=e;t&&(e.selected=[t],e.init(t))})()},render(){let{depend:t,modelValue:n}=this;if(this.readonly){const r=Ho(n,t,this.tenant);return(0,e.createVNode)("span",{key:r.id},[r.title])}return(0,e.createVNode)(e.Fragment,null,[(0,e.createVNode)((0,e.resolveComponent)("van-field"),{"is-link":!0,readonly:!0,label:this.label,name:this.name,rules:this.rules,modelValue:this.showValue,onClick:this.show},null),(0,e.createVNode)((0,e.resolveComponent)("van-popup"),{show:this.visible,teleport:"body",round:!0,position:"bottom"},{default:()=>[(0,e.createVNode)((0,e.resolveComponent)("van-picker"),{modelValue:this.selected,columns:this.columns,onCancel:this.hide,onConfirm:this.change},null)]})])},methods:{hide(){this.visible=!1},show(){this.visible=!0},init(e){const{columns:t}=this;if(!e)return this.showValue=null;for(let n=0;n<t.length;n++)if(t[n].value===e)return this.showValue=t[n].text;this.showValue=null},change({selectedValues:e}){const t=e.length>0?e[0]:null;this.init(t),this.$emit("update:modelValue",t),this.hide()},initSelected(){var e=this;return p(function*(){const{depend:t,tenant:n,keyword:r}=e;let a={page:0,pageSize:20,depend:t,params:{tenant:n}};r&&(a.keyword=r);try{e.columns=(yield $.get({data:a,url:"/api/zen/search",context:e})).map(e=>({text:e.title,value:e.id}))}catch(o){}})()}}};var Yo=ao({inheritAttrs:!1,props:{name:String,modelValue:[String,Array],label:String,options:Array,rules:[Array,Object]},data:()=>({visible:!1,selected:[],showValue:null}),created(){const{modelValue:e}=this;e&&(this.selected=[e],this.init(e))},computed:{columns(){return this.options.map(({label:e,value:t})=>({text:e,value:t}))}},methods:{init(e){const{options:t}=this;if(!e)return this.showValue=null;for(let n=0;n<t.length;n++)if(t[n].value===e)return this.showValue=t[n].label;this.showValue=null},change({selectedValues:e}){this.$emit("update:modelValue",e[0]),this.init(e[0]),this.visible=!1}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field"),l=(0,e.resolveComponent)("van-picker"),u=(0,e.resolveComponent)("van-popup");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createVNode)(s,{"is-link":"",readonly:"",label:r.label,name:r.name,rules:r.rules,onClick:n[0]||(n[0]=e=>o.visible=!0)},{input:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(o.showValue),1)]),_:1},8,["label","name","rules"]),(0,e.createVNode)(u,{show:o.visible,"onUpdate:show":n[3]||(n[3]=e=>o.visible=e),teleport:"body",round:"",position:"bottom"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(l,{modelValue:o.selected,"onUpdate:modelValue":n[1]||(n[1]=e=>o.selected=e),columns:i.columns,onCancel:n[2]||(n[2]=e=>o.visible=!1),onConfirm:i.change},null,8,["modelValue","columns","onConfirm"])]),_:1},8,["show"])],64)}]]);var Jo=ao({inheritAttrs:!1,props:{name:String,label:String,formData:Object,url:String,trueValue:{type:String,default:"1"},falseValue:{type:String,default:"0"},rules:[Array,Object]},methods:{methods:{change(e){var t=this;return p(function*(){let{url:n,name:r,formData:a}=t;if(!n)return;let o={};a.id&&(o.id=a.id),o[r]=e,yield $.post({data:o,url:n},t)})()}}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-switch"),l=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(l,{label:r.label,name:r.name,rules:r.rules},{input:(0,e.withCtx)(()=>[(0,e.createVNode)(s,(0,e.mergeProps)({onChange:t.change},t.$attrs,{"active-value":r.trueValue,"inactive-value":r.falseValue}),null,16,["onChange","active-value","inactive-value"])]),_:1},8,["label","name","rules"])}]]);var Wo=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,rules:[Array,Object]}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(s,(0,e.mergeProps)({name:r.name},t.$attrs,{type:"tel",label:r.label,rules:r.rules}),null,16,["name","label","rules"])}]]);var Ko=ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,rules:[Array,Object]}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(s,{label:r.label},{input:(0,e.withCtx)(()=>[(0,e.createElementVNode)("span",null,(0,e.toDisplayString)(t.$attrs.modelValue),1)]),_:1},8,["label"])}]]);var Xo={attach:zo,user:$o,tel:Wo,search:qo,checkbox:No,date:Oo,number:Io,radiobox:Po,select:Yo,textarea:ao({inheritAttrs:!1,props:{name:String,formData:Object,label:String,maxlength:{type:Number,default:100},rules:[Array,Object]}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-field");return(0,e.openBlock)(),(0,e.createBlock)(s,(0,e.mergeProps)({"label-align":"top",maxlength:r.maxlength},t.$attrs,{"show-word-limit":"",label:r.label,rules:r.rules}),null,16,["maxlength","label","rules"])}]]),image:To,input:Ro,daterange:jo,money:Mo,switch:Jo,address:Co,text:Ko,password:Uo},Go={props:{label:String,type:String,component:[Function,Object],code:[String,Number],rules:[Array,Object],tip:String,multiple:Boolean,name:String,value:Object,visible:{},default:[String,Number,Object,Array]},setup(t){const{value:n,name:r,visible:a,default:o,type:i="input"}=t,s=(0,e.inject)("$form",{}),l=(0,e.reactive)({hide:!1});void 0!==a&&("boolean"==typeof a?l.hide=!a:(l.hide=!a(s.formData),(0,e.watch)(s.formData,e=>{l.hide=!a(e)}))),void 0===n[r]&&(n[r]=o||null);let u=t.component;return!u&&i&&(u=Xo[i],u||(u=(0,e.resolveComponent)($.tagName(i,"a")))),{status:l,com:u}},render(){if(this.status.hide)return null;let{$attrs:t,name:n,input:r,label:a,rules:o,code:i,value:s,multiple:l}=this;const u=s[n];return i?(0,e.createVNode)((0,e.resolveComponent)("z-dict"),{label:a,rules:o,name:n,type:this.type,multiple:l,code:i,"onUpdate:modelValue":r,modelValue:u},null):(0,e.h)(this.com,dr(dr({},t),{},{label:a,rules:o,multiple:l,name:n,formData:s,modelValue:u,"onUpdate:modelValue":r}))},methods:{input(e){let{name:t}=this;t&&(this.value[t]=e),this.$emit("change",e,this.value)}}};var Qo={props:{field:Object,path:Array,formData:Object,parentData:Object},setup(t){const{field:n,formData:r,parentData:a}=t,o=(0,e.ref)(!1),{name:i}=n,s=(0,e.ref)(i?a[i]:a),{visible:l}=n;return l&&("boolean"==typeof l?o.value=!l:(o.value=!l(r),(0,e.watch)(r,e=>{o.value=!n.visible(e)}))),{isHide:o,childData:s}},render(){const{isHide:t,path:n,field:r,childData:a}=this;if(t)return null;let{children:o,label:i}=r,s=[];return o.forEach(t=>{if(Array.isArray(t))return $.error("Fields\u914d\u7f6e\u4e0d\u80fd\u662f\u4e8c\u7ef4\u6570\u7ec4");const r=t.name,o=r?[...n,r]:n,i=$.omit(t,["children","slot"]);s.push((0,e.createVNode)(Go,(0,e.mergeProps)(i,{key:o.join("-"),value:a}),null))}),i?(0,e.createVNode)((0,e.resolveComponent)("van-cell-group"),{title:i},"function"==typeof(l=s)||"[object Object]"===Object.prototype.toString.call(l)&&!(0,e.isVNode)(l)?s:{default:()=>[s]}):(0,e.createVNode)("div",{class:"group"},[s]);var l}};var ei=function(e,t,n=0){const r=e.length;if(r<1)return t;const a=e[n];return n===r-1?t[a]:(n++,ei(e,t[a],n))},ti={inject:{$form:{default:null},$button:{default:null}},emits:["change"],props:{label:String,fields:Array,value:Object,inited:Boolean,readonly:{type:Boolean,default:!1},rules:{type:Object,default:function(){return{}}},name:String},data:()=>({slots:null}),computed:{formData(){return this.value||this.$form.data}},created(){var e,t;this.slots=vo(vo(null===(e=this.$button)||void 0===e?void 0:e.$slots,null===(t=this.$form)||void 0===t?void 0:t.$slots),this.$slots);const{name:n}=this;if(!this.inited){let e;n?(this.formData[n]||(this.formData[n]={}),e=this.formData[n]):e=this.formData,this.fields.forEach(t=>{_o(t,e)})}},render(){let{fields:t,label:n,name:r,formData:a}=this,o=t.map(t=>{const n=r?[r]:[],o=ei(n,a);if(t.children)return(0,e.createVNode)(Qo,{path:n,field:t,parentData:o,formData:a},null);const i=n.join("-");return(0,e.createVNode)(Go,(0,e.mergeProps)(t,{key:i,value:o}),null)});return n?(0,e.createVNode)((0,e.resolveComponent)("van-cell-group"),{title:n},"function"==typeof(i=o)||"[object Object]"===Object.prototype.toString.call(i)&&!(0,e.isVNode)(i)?o:{default:()=>[o]}):o;var i}},ni={props:{modelValue:[String,Array],autoPreview:{type:Boolean,default:!0}},data:()=>({show:!1,fileList:[]}),created(){const{modelValue:e}=this;this.fileList=Array.isArray(e)?e:[e]},methods:{click(e){(0,t.showImagePreview)({images:this.fileList,startPosition:e,closeable:!0})}}},ri={class:"z-image"};var ai=ao(ni,[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-image");return(0,e.openBlock)(),(0,e.createElementBlock)("div",ri,[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(o.fileList,(t,n)=>((0,e.openBlock)(),(0,e.createBlock)(s,{position:"center",onClick:e=>i.click(n),key:n,src:t},null,8,["onClick","src"]))),128))])}]]),oi="all",ii=(0,e.defineComponent)({name:"ZList",inheritAttrs:!1,emits:["finish"],props:{url:String,conditions:Array,emptyText:String,params:Object,tabs:Array,code:String,tabName:String,gutter:Number,tabType:{type:String,default:"line"},tabValue:[String,Number],size:{type:Number,default:15}},setup(t,n){const r=(0,e.ref)(!1),a=(0,e.ref)(!1),o=(0,e.ref)(!1),i=(0,e.ref)(1),s=(0,e.ref)(0),l=(0,e.ref)(!1),u=(0,e.inject)("$dict"),c=(0,e.ref)({}),d=(0,e.ref)(oi);let h=(0,e.ref)(!1),f=(0,e.ref)([]),m=(0,e.ref)(t.tabs);const g=({name:e})=>{if(e===d.value)return;const{tabName:n}=t;e===oi?delete c.value[n]:c.value[n]=e,d.value=e,b()},b=$.debounce(p(function*(){if(h.value)return a.value=!1;h.value=!0,i.value=1,f.value=[],a.value=!0,yield y()})),v=()=>{h.value=!1,a.value=!1},y=(_=p(function*(){const a={},{size:l,url:u}=t,d=(0,e.toRaw)(t.params);for(let e in d)a[e]=d[e];for(let e in c.value)a[e]=c.value[e];l>0&&(a.page=i.value-1,a.pageSize=l);try{let e,t=yield $.get({data:a,url:u},n);if(!t)return r.value=!0,n.emit("finish",t);void 0!==t.total?(s.value=t.total,r.value=!0,e=t.list):e=t,r.value=0===e.length,o.value?e.forEach(e=>f.value.push(e)):f.value=e,n.emit("finish",t)}catch(h){throw--i.value,r.value=!0,v(),h}finally{(0,e.nextTick)(v)}}),function(){return _.apply(this,arguments)});var _;(0,e.watch)((0,e.computed)(()=>t.url),b),(0,e.watch)((0,e.computed)(()=>t.params),b),(0,e.provide)("$table",{refresh:b});const{code:w,tabValue:k}=t;if(w){const e=u(w);m.value=[{label:"\u5168\u90e8",value:oi},...e.v],void 0===k&&(d.value=k)}return m.value&&!w&&void 0===k&&g({name:m.value[0].value}),(0,e.onBeforeMount)(p(function*(){yield y(),o.value=0===s.value})),{refreshing:a,page:i,total:s,tabList:m,error:l,finished:r,tab:d,items:f,loading:h,loadMore:()=>{o.value?(i.value++,y()):h.value=!1},refresh:b,jump:e=>{i.value=e,y()},tabClick:g}}}),si={class:"z-list"},li={key:1,class:"empty"},ui={key:1,class:"wrap"};var ci=ao(ii,[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-tab"),l=(0,e.resolveComponent)("van-tabs"),u=(0,e.resolveComponent)("van-icon"),c=(0,e.resolveComponent)("van-row"),d=(0,e.resolveComponent)("van-list"),h=(0,e.resolveComponent)("van-pull-refresh"),f=(0,e.resolveComponent)("van-pagination");return(0,e.openBlock)(),(0,e.createElementBlock)("div",si,[t.tabList?((0,e.openBlock)(),(0,e.createBlock)(l,{key:0,active:t.tab,type:t.tabType,onClickTab:t.tabClick,sticky:""},{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.tabList,t=>((0,e.openBlock)(),(0,e.createBlock)(s,{key:t.value,name:t.value,title:t.label},null,8,["name","title"]))),128))]),_:1},8,["active","type","onClickTab"])):(0,e.createCommentVNode)("",!0),(0,e.renderSlot)(t.$slots,"condition"),(0,e.renderSlot)(t.$slots,"default"),0!==t.items.length||t.loading?(0,e.createCommentVNode)("",!0):((0,e.openBlock)(),(0,e.createElementBlock)("div",li,[(0,e.createVNode)(u,{name:"info"}),(0,e.createTextVNode)(" "+(0,e.toDisplayString)(t.emptyText||"\u6682\u65e0\u76f8\u5173\u6570\u636e"),1)])),(0,e.createVNode)(h,{modelValue:t.refreshing,"onUpdate:modelValue":n[2]||(n[2]=e=>t.refreshing=e),onRefresh:t.refresh},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(d,{loading:t.loading,"onUpdate:loading":n[0]||(n[0]=e=>t.loading=e),offset:100,error:t.error,"onUpdate:error":n[1]||(n[1]=e=>t.error=e),finished:t.finished,"immediate-check":!1,onLoad:t.loadMore},{default:(0,e.withCtx)(()=>[t.gutter?((0,e.openBlock)(),(0,e.createBlock)(c,{key:0,gutter:t.gutter},{default:(0,e.withCtx)(()=>[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.items,n=>(0,e.renderSlot)(t.$slots,"row",(0,e.mergeProps)({key:n.id},{ref_for:!0},n))),128))]),_:3},8,["gutter"])):((0,e.openBlock)(),(0,e.createElementBlock)("div",ui,[((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.items,n=>(0,e.renderSlot)(t.$slots,"row",(0,e.mergeProps)({key:n.id},{ref_for:!0},n))),128))]))]),_:3},8,["loading","error","finished","onLoad"])]),_:3},8,["modelValue","onRefresh"]),t.total>0?((0,e.openBlock)(),(0,e.createBlock)(f,{key:2,modelValue:t.page,"onUpdate:modelValue":n[3]||(n[3]=e=>t.page=e),"total-items":t.total,onChange:t.jump,mode:"simple","items-per-page":t.size},null,8,["modelValue","total-items","onChange","items-per-page"])):(0,e.createCommentVNode)("",!0)])}]]),di={},hi={};const fi=function(t,n){if(di[n]||(di[n]=(0,e.reactive)({})),di[n][t])return di[n][t];let r=hi[n];return r||(r={queue:[],id:null,depend:n},hi[n]=r),new Promise(e=>{var a;r.queue.push({id:t,callback:e}),null===r.id&&r.queue.length>0&&(r.id=setTimeout((a=p(function*(e){const t=[];e.queue.forEach(({id:e})=>!t.includes(e)&&t.push(e));const r=yield $.get({data:{list:t,depend:e.depend},url:"/api/zen/search"});r&&r.forEach(e=>{di[n][e.id]=e}),e.queue.forEach(({id:e,callback:t})=>{t(di[n][e])}),clearTimeout(e.id),e.queue=[],e.id=null}),function(e){return a.apply(this,arguments)}),60,r))})};var pi={props:{modelValue:[String,Number,Array],depend:String},render(){let{depend:t,modelValue:n,$attrs:r}=this;if(void 0===n)return null;if(t){if(Array.isArray(n)){const a=n.map(e=>fi(e,t));return(0,e.createVNode)("span",(0,e.mergeProps)({class:"z-text"},r),[a.map(t=>(0,e.createVNode)("i",{key:t.id},[t.title]))])}const a=fi(n,t);return(0,e.createVNode)("span",(0,e.mergeProps)({class:"z-text"},r,{key:a.id}),[a.title])}return(0,e.createVNode)("span",(0,e.mergeProps)({class:"z-text"},r),[n])}},mi={props:{value:String,plain:{type:Boolean,default:!0},size:{type:String,default:"24px"}},data:()=>({nano:null,bg:null,isDark:!1}),render(){const{nano:t,plain:n,value:r,error:a,size:o}=this,i=b(r);if(!i.nick)return null;if(!t&&!i.avatar)return a(),null;const s=(0,e.createVNode)("div",{class:["z-avatar",{dark:this.isDark}],style:{background:this.bg,width:o,height:o,lineHeight:o},key:i.id},[t||(0,e.createVNode)((0,e.resolveComponent)("van-image"),{round:!0,fit:"cover",onError:a,src:i.avatar},null)]);return(0,e.createVNode)("div",{class:"z-avatar-wrap"},[(0,e.createVNode)("div",{class:"items"},[s,n?null:(0,e.createVNode)("span",{class:"nick"},[i.nick])])])},methods:{error(){const e=b(this.value).nick[0],t=$.color(zen.color).toHsl(),n=e.charCodeAt()%360,r=$.color({h:n,s:t.s,l:t.l});this.isDark=$.color(r).isDark(),this.nano=e,this.bg=r.alpha(.8).toRgbString()}}},gi={copy:lo,csl:oo,qr:eo,block:Ga,money:Lo,image:ai,dict:po,action:ro,form:bo,list:ci,date:Qa,text:pi,"form-items":ti,"cms-com":Ka,user:{props:{value:String,label:String,modelValue:[String,Array]},render(){const{label:t,value:n}=this;let r;if(Array.isArray(n))r=n.map(e=>b(e)).map(t=>(0,e.createVNode)("span",{class:"z-nick",key:t.id},[t.nick]));else{const t=b(n);r=(0,e.createVNode)("span",{class:"z-nick",key:t.id},[t.nick])}return t?(0,e.createVNode)((0,e.resolveComponent)("van-cell"),{title:t},{value:r}):r}},avatar:mi},bi=["money"];var vi=ao({data:()=>({show:!1}),created(){$.on("showLoading",e=>{this.show=e})}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-loading"),l=(0,e.resolveComponent)("van-overlay");return(0,e.openBlock)(),(0,e.createBlock)(l,{show:o.show},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(s,{style:{"text-align":"center","margin-top":"160px"}},{default:(0,e.withCtx)(()=>[...n[0]||(n[0]=[(0,e.createTextVNode)(" \u52a0\u8f7d\u4e2d... ",-1)])]),_:1})]),_:1},8,["show"])}]]),yi="ssoKey",_i={style:{"text-align":"center",margin:"60px 0"}};var wi=ao({data:()=>({color:zen.color}),created(){var e=this;return p(function*(){let{token:t}=e.$route.params;const n=$.getParams(),{_t:r,xy:a,code:o=n.code,state:i}=e.$route.query;if(a&&(t=yield $.get({url:"/api/auth/wxSubcribe",data:{xy:a}})),o&&!t&&(t=yield $.get({url:"/api/home/openPlatform",data:{code:o,state:i}})),r&&(t=r),!t)return;$.token(t);const s=window.sessionStorage[yi];if(s)return window.sessionStorage.removeItem(yi),void(yield $.post({url:"/api/auth/sso",data:{ssoKey:s}}));e.goHome()})()},methods:{goHome(){let e=sessionStorage._ldr_;if(!e){e="/welcome";const{history:t}=this.$router.options;t&&t.base&&(e=t.base+e);const{pathname:n}=location;n.indexOf(".htm")>-1&&(e=n+"#"+e)}location.href=e}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-count-down"),l=(0,e.resolveComponent)("van-loading");return(0,e.openBlock)(),(0,e.createElementBlock)("div",_i,[(0,e.createVNode)(l,{type:"spinner",color:o.color},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(s,{time:15e3,format:"\u6b63\u5728\u767b\u9646\u4e2d\uff08ss\uff09...",onFinish:t.finish},null,8,["onFinish"])]),_:1},8,["color"])])}]]),ki=/^1[3-9]\d{9}$/,xi={class:"z-p72"};var $i=ao({data:()=>({phone:"",code:"",time:0}),methods:{getCode(){var e=this;return p(function*(){if(!e.validatePhone())return;const{phone:t}=e;yield $.post({url:"/api/auth/sendSms",data:{phone:t}}),e.time=6e4,$.success("\u77ed\u4fe1\u5df2\u53d1\u9001\uff0c\u8bf7\u6ce8\u610f\u67e5\u6536")})()},finish(){this.time=0},submit(){var e=this;return p(function*(){if(!e.validatePhone()||!e.code)return;const{phone:t,code:n}=e,r=yield $.post({url:"/api/auth/bindPhone",data:{phone:t,code:n}});$.post({url:"/kooteam/api/home/message",data:{messageId:r}});const{reback:a}=e.$route.query;a?$.open(a,"_self"):e.$router.go(-1)})()},validatePhone(){return!!ki.test(this.phone)||($.error("\u8bf7\u8f93\u5165\u6709\u6548\u7684\u624b\u673a\u53f7"),!1)}}},[["render",function(t,n,r,a,o,i){const s=(0,e.resolveComponent)("van-icon"),l=(0,e.resolveComponent)("van-field"),u=(0,e.resolveComponent)("van-count-down"),c=(0,e.resolveComponent)("van-button");return(0,e.openBlock)(),(0,e.createElementBlock)("div",xi,[(0,e.createVNode)(s,{name:"sign",size:"40px",class:"icon"}),n[4]||(n[4]=(0,e.createElementVNode)("p",{style:{"text-align":"center",color:"#666"}},"\u8bf7\u5148\u7ed1\u5b9a\u60a8\u7684\u624b\u673a\u53f7\u7801",-1)),(0,e.createVNode)(l,{modelValue:o.phone,"onUpdate:modelValue":n[0]||(n[0]=e=>o.phone=e),type:"number",label:"\u624b\u673a\u53f7",placeholder:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7",maxlength:"11"},null,8,["modelValue"]),(0,e.createVNode)(l,{modelValue:o.code,"onUpdate:modelValue":n[1]||(n[1]=e=>o.code=e),center:"",clearable:"",label:"\u9a8c\u8bc1\u7801",placeholder:"\u8bf7\u8f93\u5165\u77ed\u4fe1\u9a8c\u8bc1\u7801"},{button:(0,e.withCtx)(()=>[o.time>0?((0,e.openBlock)(),(0,e.createBlock)(u,{key:0,format:"ss \u79d2\u540e\u91cd\u8bd5",time:o.time,onFinish:i.finish},null,8,["time","onFinish"])):((0,e.openBlock)(),(0,e.createBlock)(c,{key:1,size:"small",type:"primary",onClick:i.getCode},{default:(0,e.withCtx)(()=>[...n[2]||(n[2]=[(0,e.createTextVNode)("\u53d1\u9001\u9a8c\u8bc1\u7801",-1)])]),_:1},8,["onClick"]))]),_:1},8,["modelValue"]),(0,e.createVNode)(c,{type:"primary",block:"",onClick:i.submit},{default:(0,e.withCtx)(()=>[...n[3]||(n[3]=[(0,e.createTextVNode)("\u7ed1\u5b9a\u624b\u673a\u53f7",-1)])]),_:1},8,["onClick"])])}]]);var Si=ao({created(){var e=this;return p(function*(){const{query:t}=e.$route;"noMobile"===(yield $.get({url:"/api/auth/code",data:t}))&&e.$router.push({path:"/_bind",query:{reback:window.location.href}})})()}},[["render",function(t,n,r,a,o,i){return(0,e.openBlock)(),(0,e.createElementBlock)("div",null,"\u6b63\u5728\u8df3\u8f6c\u4e2d...")}]]),Ci={style:{margin:"60px auto","text-align":"center"}};var Vi=[{path:"/auth_",component:wi},{path:"/auth_/:token",component:wi},{path:"/_bind",component:$i},{path:"/404",component:ao({},[["render",function(t,n){const r=(0,e.resolveComponent)("van-icon");return(0,e.openBlock)(),(0,e.createElementBlock)("div",Ci,[(0,e.createVNode)(r,{color:"#ee0a24",size:"36px",name:"warn-o"}),n[0]||(n[0]=(0,e.createElementVNode)("div",{style:{color:"#666"}},"\u670d\u52a1\u7aef\u7f51\u7edc\u5f02\u5e38",-1))])}]])},{path:"/_code",component:Si},{path:"/_login",component:ao({},[["render",function(t,n){return(0,e.openBlock)(),(0,e.createElementBlock)("div",null,"\u65e0\u7ebf\u767b\u5f55\u9875\u9762")}]])}],zi={"light-3":3,"light-5":5,"light-7":7,"light-8":8,"light-9":9,"dark-2":-2},Ni={primary:"",danger:"#ff6f80",error:"#db2828",warning:"#E6A23C",info:"#909399"};function Ai(){return(Ai=p(function*(r={}){const a=window.document;let{com:o,routes:i,components:s,plugins:l,dict:u=[],routeMap:c={}}=r;c["/_bind"]={wehatMini:"pages/bindPhone/bind",isTab:!1};const{pathname:d}=location;let h=a.createElement("div");a.body.appendChild(h);let{env:f}=zen;if(f||!/micromessenger/i.test(navigator.userAgent)&&"undefined"==typeof WeixinJSBridge||(f="wechat",zen.env=f),"wechatMini"!==f&&"wechat"!==f||window.wx||(yield $.resource(["https://res.wx.qq.com/open/js/jweixin-1.6.0.js"])),"wechatMini"===zen.env)try{const{WeixinJSBridge:e}=window;e&&e.on("onPageStateChange",e=>{if(e.active)return $.emit("miniAppPageEnter");$.emit("miniAppPageLeave")})}catch(b){}const m=(0,e.createApp)({provide:{$dict(e,t){if(!e)return u;const n=u[e]||[];if(!t)return e.startsWith("cfg_")?(a=u,(r=e)?(Ja[r]||(Ja[r]={v:[],t:2},Wa.queue.push(r)),null===Wa.id&&Wa.queue.length>0&&(Wa.id=setTimeout(p(function*(){const e=yield $.get({data:{list:Wa.queue},url:"/api/zen/cfg"});Object.keys(e).forEach(t=>{const n=e[t];if(0===n.length){const e=a[t];return void(e&&(Ja[t].v=e.v))}Ja[t].v=n}),clearTimeout(Wa.id),Wa.queue=[],Wa.id=null}),60)),Ja[r]):[]):n;var r,a;for(let o=0;o<n.length;o++)if(n[o].value===t)return n[o];return null},jump:()=>{}},data:()=>({theme:"dark",timestamp:Date.now()}),created(){this.theme=function(e){const t="yes"===window.localStorage._dark_;e||(e=window.localStorage._skin_||"#047dfb"),Ni.primary=e;let n=document.querySelector(":root");const r=Object.keys(Ni),a=$.color(e).toHsl();return r.forEach(e=>{const t=$.color(Ni[e]).toHsl();Ni[e]=$.color({h:t.h,s:t.s,l:a.l}).toHex()}),Object.keys(Ni).forEach(t=>{let r;if("primary"===t)r=e;else{const e=$.color(Ni[t]).toHsl();r=$.color({h:e.h,s:e.s,l:a.l}).toHex()}const o="--a-color-"+t;Object.keys(zi).forEach(e=>{const t=zi[e],a=o+"-"+e;let i;t>0?(i=$.color(r).lighten(.05*t),1===$.color(e).brightness()&&(i=$.color(r).lighten(.04*t))):i=$.color(r).darken(-parseInt(.04*t)),n.style.setProperty(a,i.toHex())}),n.style.setProperty(o,r)}),zen.color=e,{theme:t?"dark":"light"}}(zen.color).theme},mounted(){document.addEventListener("visibilitychange",()=>{if("visible"===document.visibilityState){const e=Date.now();e-this.timestamp>36e5?location.reload(!0):this.timestamp=e}})},render(){const{theme:t}=this;return(0,e.createVNode)((0,e.resolveComponent)("van-config-provider"),{theme:t},{default:()=>[i?(0,e.createVNode)((0,e.resolveComponent)("RouterView"),null,null):(0,e.h)(o),(0,e.createVNode)(vi,null,null),(0,e.createVNode)("div",{id:"z-mini-bg"},null)]})}});if(function(t,n){Object.keys(gi).forEach(n=>{t.component($.tagName(n,"z"),(0,e.defineComponent)(gi[n]))}),n&&Object.keys(n).forEach(r=>{bi.includes(r)?t.component($.tagName(r,"z"),(0,e.defineComponent)(n[r])):t.component($.tagName(r,"a"),(0,e.defineComponent)(n[r]))})}(m,s),m.use(t.default).component("z-com",Za.com),m.use(t.Lazyload),l&&m.use(l),i){const e=[{component:o,path:"",children:[{path:"/:catchAll(.*)",name:"CMS_",component:Xa}]},...Vi];i.forEach(t=>{t.children?e.unshift(t):e[0].children.unshift(t)});let t="";0===d.indexOf("/ac-")&&(window._apps=[],t=d.split("/")[1],zen.app.name=t);const r=(0,n.createRouter)({history:d.indexOf(".html")>-1?(0,n.createWebHashHistory)():(0,n.createWebHistory)(t),routes:e,scrollBehavior:()=>({top:0,behavior:"smooth"})});r.beforeEach((e,t,n)=>{if($.tracker.enter(e.path,e.query).send(),"wechatMini"===zen.env&&t.path.length>2)return function(e,t,n){const r=n[e];let a="";if(t){const e=[];Object.keys(t).forEach(n=>{e.push(`${n}=${t[n]}`)}),a="?"+e.join("&")}if(!r){let t=parseInt($.getParams().breadcrumb||"0");return t++,t>3&&(t=1),e=`/pages/breadcrumb/b${t}/b${t}?link=${encodeURIComponent(e+a)}`,wx.miniProgram.navigateTo({url:e})}r.isTab?wx.miniProgram.switchTab({url:"/"+r.wehatMini,query:t}):wx.miniProgram.navigateTo({url:"/"+r.wehatMini+a})}(e.path,e.query,c),!1;n()}),m.use(r)}const{globalProperties:g}=m.config;return zen.instance=g,m.mount(h),g})).apply(this,arguments)}var Oi={};function Ei(){return(Ei=p(function*(e,t={},n=!1){const r=window.location.href.split("#")[0],a=Array.isArray(e)?e[0]:e,o=r+"-"+a;Oi[o]&&wx.ready(()=>{wx[a](t)});const i=yield $.get({url:"/api/home/wxJsAuth",data:{url:r}});wx.config(dr(dr({debug:n},i),{},{jsApiList:Array.isArray(e)?e:[e]})),Oi[o]=!0,wx.ready(()=>{wx[a](t)})})).apply(this,arguments)}var Di={wxApi:function(e){return Ei.apply(this,arguments)},scan:(e=["qrCode","barCode"],t=!1)=>new Promise((n,r)=>{$.wxApi(["scanQRCode"],{needResult:1,scanType:e,fail:r,success(e){n(e.resultStr)}},t)}),camera:(e="/api/home/wxFile",t)=>new Promise((n,r)=>{$.wxApi(["chooseImage","uploadImage"],{count:1,sizeType:["compressed"],sourceType:["camera"],fail:r,success:r=>p(function*(){wx.uploadImage({localId:r.localIds[0],success:({serverId:r})=>p(function*(){n(yield $.get({url:e,data:dr(dr({},t),{},{serverId:r})}))})()})})()})})},ji=window,Bi=document;ji.zen={app:{name:"",tag:""},user:{},selfs:{},color:null,path:qa.path,res:null,instance:null,platform:"",component:Za.reigster,isReigster:Za.isReigster,setup:function(){return Ai.apply(this,arguments)}},function(e){Fa.apply(this,arguments)}(ji,Di),function(){const e=window.$;e.fail=function(e){return Ya(e,"fail"),!1},e.success=function(e){return Ya(e,"success"),!0},e.error=function(t){return e.fail(t)},e.loading=function(){return $.emit("showLoading",!0),{close:()=>$.emit("showLoading",!1)}},e.confirm=function(e,n,r){const a=r?t.showConfirmDialog:t.showDialog,o=zen.color||"#ee0a24";return a({message:e,theme:"round-button","confirm-button-color":o,"cancel-button-color":$.color(o).lighten(.2).toHex()}).then(()=>{n&&n()}).catch(()=>{r&&r()})}}(),Bi.addEventListener("DOMContentLoaded",p(function*(){const{href:e}=window.location;(e.indexOf("_console_")>-1||sessionStorage._cl_)&&(yield $.resource("//a.ebus.vip/vconsole.min.js"),new VConsole)}))});