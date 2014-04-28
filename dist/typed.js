// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="jquery.d.ts" />
/// <reference path="lodash.d.ts" />
/// <reference path="Hashable.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

/**
* Simple object that all framework objects derive of.
*/
var BaseObject = (function () {
    function BaseObject() {
    }
    /**
    * Simple cast method
    */
    BaseObject.prototype.Cast = function () {
        return this;
    };

    /**
    * Get the typename of the current object
    */
    BaseObject.prototype.GetType = function () {
        //return new ObjectType(<ConstructorPrototype> (<any> this).constructor.prototype);
        if (Object.getPrototypeOf)
            return new ObjectType(Object.getPrototypeOf(this));

        try  {
            return new ObjectType(this.__proto__.constructor);
        } catch (e) {
            console.warn('This browser does not support dynamic prototype retrieval.');
            return undefined;
        }
    };
    return BaseObject;
})();

var HashableObject = (function (_super) {
    __extends(HashableObject, _super);
    function HashableObject() {
        _super.call(this);
        this._objectHash = HashableObject._instanceCount++;
    }
    /**
    * Get a unique hashcode for the given object in the form of a number.
    */
    HashableObject.prototype.GetHashCode = function () {
        return this._objectHash;
    };
    HashableObject._instanceCount = 0;
    return HashableObject;
})(BaseObject);

/**
* Provides information about an object/class/prototype.
*/
var ObjectType = (function () {
    function ObjectType(objPrototype) {
        this.objPrototype = objPrototype;
    }
    Object.defineProperty(ObjectType.prototype, "Name", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ObjectType.prototype, "ModuleName", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ObjectType.prototype, "FullName", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ObjectType.prototype, "IsAbstract", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });

    ObjectType.prototype.GetOwnProperties = function () {
        return Object.getOwnPropertyNames(this.objPrototype);
    };

    ObjectType.prototype.GetProperties = function () {
        return [];
    };

    ObjectType.prototype.GetMethods = function () {
        return [];
    };
    return ObjectType;
})();
var Exception = (function () {
    function Exception(message) {
        this.name = 'Exception';
        this.message = 'No message given.';
        if (message !== undefined)
            this.message = message;
    }
    Exception.IgnoreOrDefault = function (obj, callback, def) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 3); _i++) {
            args[_i] = arguments[_i + 3];
        }
        try  {
            var args = [].concat(arguments).splice(2);
            return callback.apply(obj, args);
        } catch (e) {
            return def;
        }
    };

    Exception.IgnoreAll = function (obj, callback) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        try  {
            var args = [].concat(arguments).splice(2);
            callback.apply(obj, args);
        } catch (e) {
        }
    };

    Exception.Ignore = function (callback) {
        try  {
            callback();
        } catch (e) {
        }
    };
    return Exception;
})();
Exception.prototype = Error;

var RuntimeException = (function (_super) {
    __extends(RuntimeException, _super);
    function RuntimeException(message) {
        _super.call(this, message);
        this.name = 'RuntimeException';
        this.message = 'No message given.';
    }
    RuntimeException.prototype.toString = function () {
        return 'Exception "' + this.name + '" occurred with message; ' + this.message;
    };
    return RuntimeException;
})(Exception);

var NotImplementedException = (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        _super.apply(this, arguments);
        this.name = 'NotImplementedException';
    }
    return NotImplementedException;
})(RuntimeException);
var AbstractMethodException = (function (_super) {
    __extends(AbstractMethodException, _super);
    function AbstractMethodException() {
        _super.apply(this, arguments);
        this.name = 'AbstractMethodException';
        this.message = 'This method is an abstract stub. (As typescript does not support the abstract keyword). Please make sure this method is implemented if you get this exception.';
    }
    return AbstractMethodException;
})(NotImplementedException);
var MethodNotOverwrittenException = (function (_super) {
    __extends(MethodNotOverwrittenException, _super);
    function MethodNotOverwrittenException() {
        _super.apply(this, arguments);
        this.name = 'MethodNotOverwrittenException';
        this.message = 'This method\'s prototype should have been overwritten with the correct function, however, somehow it wasn\'t';
    }
    return MethodNotOverwrittenException;
})(RuntimeException);
var MethodNotAccessibleException = (function (_super) {
    __extends(MethodNotAccessibleException, _super);
    function MethodNotAccessibleException() {
        _super.apply(this, arguments);
        this.name = 'MethodNotAccessibleException';
    }
    return MethodNotAccessibleException;
})(RuntimeException);

var NullReferenceException = (function (_super) {
    __extends(NullReferenceException, _super);
    function NullReferenceException() {
        _super.apply(this, arguments);
        this.name = 'NullReferenceException';
    }
    return NullReferenceException;
})(RuntimeException);

var KeyNotFoundException = (function (_super) {
    __extends(KeyNotFoundException, _super);
    function KeyNotFoundException() {
        _super.apply(this, arguments);
        this.name = 'KeyNotFoundException';
        this.message = 'The key you gave was not found in this collection.';
    }
    return KeyNotFoundException;
})(RuntimeException);
var IndexOutOfBoundsException = (function (_super) {
    __extends(IndexOutOfBoundsException, _super);
    function IndexOutOfBoundsException() {
        _super.apply(this, arguments);
        this.name = 'IndexOutOfBoundsException';
        this.message = 'The index given was less than 0 or larger than the length of this collection.';
    }
    return IndexOutOfBoundsException;
})(RuntimeException);
var DuplicateKeyException = (function (_super) {
    __extends(DuplicateKeyException, _super);
    function DuplicateKeyException() {
        _super.apply(this, arguments);
        this.name = 'DuplicateKeyException';
        this.message = 'The key you wanted to add already exists on this collection.';
    }
    return DuplicateKeyException;
})(RuntimeException);

var InvalidArgumentException = (function (_super) {
    __extends(InvalidArgumentException, _super);
    function InvalidArgumentException() {
        _super.apply(this, arguments);
        this.name = 'InvalidArgumentException';
        this.message = 'The argument given to this method was invalid.';
    }
    return InvalidArgumentException;
})(RuntimeException);
var Guid = (function (_super) {
    __extends(Guid, _super);
    function Guid(_guid) {
        _super.call(this);
        this._guid = _guid;
    }
    Guid.prototype.CompareTo = function (guid) {
        if (guid.toString() == this._guid)
            return 0;
        if (guid.toString() > this._guid)
            return 1;
        if (guid.toString() < this._guid)
            return -1;
        throw new Error('Error during comparing, this JS engine really sucks.');
    };

    Guid.prototype.toString = function () {
        return this._guid;
    };

    Guid.NewGuid = function () {
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return new Guid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    };
    return Guid;
})(BaseObject);
/**
* Generates templates and stores the compiled versions of them.
* @static
*/
var TemplateFactory = (function () {
    function TemplateFactory() {
    }
    TemplateFactory.WithTemplate = function (name, callback) {
        if (TemplateFactory.Templates[name] !== undefined)
            return callback(TemplateFactory.Templates[name]);
        jQuery.ajax(TemplateFactory.ViewBasePath + name + '.html', {
            async: true,
            dataType: 'text',
            success: function (data) {
                TemplateFactory.Templates[name] = _.template(data);
                callback(TemplateFactory.Templates[name]);
            },
            error: function (xhr, statusCode, message) {
                return console.error('Unable to retrieve the template; ', statusCode, message);
            }
        });
    };

    TemplateFactory.GetTemplate = function (name) {
        if (TemplateFactory.Templates[name] !== undefined)
            return TemplateFactory.Templates[name];
        var tplData = '';
        jQuery.ajax(TemplateFactory.ViewBasePath + name + '.html', {
            async: false,
            dataType: 'text',
            success: function (data) {
                tplData = data;
            }
        });
        return _.template(tplData);
    };
    TemplateFactory.ViewBasePath = 'views/';
    TemplateFactory.Templates = {};
    return TemplateFactory;
})();
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="BaseObject.ts" />
/// <reference path="Comparer.ts" />
/// <reference path="EqualityComparer.ts" />
/// <reference path="Exceptions.ts" />
/// <reference path="Guid.ts" />
/// <reference path="Hashable.ts" />
/// <reference path="TemplateFactory.ts" />
var Collections;
(function (Collections) {
    var SimpleEnumerator = (function () {
        function SimpleEnumerator(items) {
            this.Index = 0;
            if (items == undefined || items == null)
                throw new InvalidArgumentException();
            this.Items = items;
        }
        Object.defineProperty(SimpleEnumerator.prototype, "Current", {
            get: function () {
                return this.Items[this.Index];
            },
            enumerable: true,
            configurable: true
        });

        SimpleEnumerator.prototype.MoveNext = function () {
            if (!this.HasNext())
                return false;
            this.Index++;
            return true;
        };

        SimpleEnumerator.prototype.HasNext = function () {
            return (this.Index + 1 < this.Items.length);
        };

        SimpleEnumerator.prototype.IsValid = function () {
            return (this.Index < this.Items.length);
        };

        SimpleEnumerator.prototype.Reset = function () {
            this.Index = 0;
        };
        return SimpleEnumerator;
    })();
    Collections.SimpleEnumerator = SimpleEnumerator;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    /**
    * Simple and fast Linq extensions
    */
    var Enumerable = (function () {
        function Enumerable() {
        }
        // Return false to cancel, return true to continue, return null to.. nothing.
        Enumerable.prototype.Each = function (callback) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return;
            do {
                callback(e.Current);
            } while(e.MoveNext());
        };

        Enumerable.prototype.BreakableEach = function (callback) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return;
            do {
                callback(e.Current, e);
            } while(e.MoveNext());
        };

        /**
        * Check whether any of the elements in this enumerable return true for the given predictate.
        * Returns false for empty collections.
        */
        Enumerable.prototype.Any = function (predictate) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return false;
            do {
                if (predictate(e.Current))
                    return true;
            } while(e.MoveNext());
            return false;
        };

        /**
        * Check whether all items in this enumerable return true for the given predictate.
        * Returns true for empty collections.
        */
        Enumerable.prototype.All = function (predictate) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return true;
            do {
                if (!predictate(e.Current))
                    return false;
            } while(e.MoveNext());
            return true;
        };

        Enumerable.prototype.ContainsDeep = function (item, extractor) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return false;
            do {
                if (extractor(e.Current) == item)
                    return true;
            } while(e.MoveNext());
            return false;
        };

        Enumerable.prototype.Where = function (predictate) {
            var e = this.GetEnumerator();
            var l = new Collections.List();
            if (e.Current == undefined)
                return l;
            do {
                if (predictate(e.Current))
                    l.Add(e.Current);
            } while(e.MoveNext());
            return l;
        };

        Enumerable.prototype.Select = function (predictate) {
            var e = this.GetEnumerator();
            var l = new Collections.List();
            if (e.Current == undefined)
                return l;
            do {
                l.Add(predictate(e.Current));
            } while(e.MoveNext());
            return l;
        };

        Enumerable.prototype.GroupBy = function (keySelector, resultSelector) {
            // Map to temporary dictionary
            var e = this.GetEnumerator();
            var d = new Collections.Dictionary();
            if (e.Current == undefined)
                return new Collections.List();
            do {
                var k = keySelector(e.Current);
                if (d.ContainsKey(k)) {
                    var t = new Collections.List();
                    d.Set(k, t);
                } else
                    d.Get(k).Add(e.Current);
            } while(e.MoveNext());

            // Map to resulting container
            var l = new Collections.List();
            d.Each(function (item) {
                return l.Add(resultSelector(item.Key, item.Value));
            });
            return l;
        };

        Enumerable.prototype.Distinct = function () {
            var e = this.GetEnumerator();
            var d = new Collections.List();
            if (e.Current == undefined)
                return d;
            do {
                if (!d.Contains(e.Current))
                    d.Add(e.Current);
            } while(e.MoveNext());
            return d;
        };

        Enumerable.prototype.Except = function (collection) {
            var e = this.GetEnumerator();
            var r = new Collections.List();
            if (e.Current == undefined)
                return r;
            do {
                if (!collection.Contains(e.Current))
                    r.Add(e.Current);
            } while(e.MoveNext());
            return r;
        };

        Enumerable.prototype.First = function (predictate) {
            var e = this.GetEnumerator();
            if (predictate == undefined)
                return e.Current;
            else {
                do {
                    if (predictate(e.Current))
                        return e.Current;
                } while(e.MoveNext());
            }
            return null;
        };

        Enumerable.prototype.FirstOrDefault = function (def, predictate) {
            var e = this.GetEnumerator();
            if (predictate == undefined)
                return e.Current;
            else {
                do {
                    if (predictate(e.Current))
                        return e.Current;
                } while(e.MoveNext());
            }
            return def;
        };

        Enumerable.prototype.Last = function (predictate) {
            var e = this.GetEnumerator();
            if (predictate == undefined) {
                var lastSatisfied = null;
                do {
                    lastSatisfied = e.Current;
                } while(e.MoveNext());
                return lastSatisfied;
            } else {
                var lastSatisfied = null;
                do {
                    if (predictate(e.Current))
                        lastSatisfied = e.Current;
                } while(e.MoveNext());
                return lastSatisfied;
            }
        };

        Enumerable.prototype.LastOrDefault = function (def, predictate) {
            var e = this.GetEnumerator();
            if (predictate == undefined) {
                var lastSatisfied = def;
                do {
                    lastSatisfied = e.Current;
                } while(e.MoveNext());
                return lastSatisfied;
            } else {
                var lastSatisfied = def;
                do {
                    if (predictate(e.Current))
                        lastSatisfied = e.Current;
                } while(e.MoveNext());
                return lastSatisfied;
            }
        };

        Enumerable.prototype.ElementAt = function (index) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return null;
            var i = 0;
            do {
                if (index == i)
                    return e.Current;
                i++;
            } while(e.MoveNext());
            return null;
        };

        Enumerable.prototype.ElementAtOrDefault = function (index) {
            var elem = this.ElementAt(index);
            if (elem == null)
                throw new Error('Index is invalid.');
            return elem;
        };

        Enumerable.prototype.IndexOfFirst = function (predictate) {
            var e = this.GetEnumerator();
            if (e.Current == undefined)
                return -1;
            var index = 0;
            do {
                if (predictate(e.Current))
                    return index;
                index++;
            } while(e.MoveNext());
            return -1;
        };

        Enumerable.prototype.Min = function (extractor) {
            var e = this.GetEnumerator();
            if (extractor == undefined) {
                if (typeof e.Current == 'number') {
                    var min = e.Current;
                    while (e.MoveNext()) {
                        if (min > e.Current)
                            min = e.Current;
                    }
                } else
                    throw new Error('Invalid type given, expected number. Please extract the correct value.');
            } else {
                if (e.Current == undefined)
                    return null;
                var minObj = e.Current;
                var minNum = extractor(e.Current);
                while (e.MoveNext()) {
                    var num = extractor(e.Current);
                    if (minNum > num) {
                        minNum = num;
                        minObj = e.Current;
                    }
                }
                return minObj;
            }
        };

        Enumerable.prototype.Max = function (extractor) {
            var e = this.GetEnumerator();
            if (extractor == undefined) {
                if (typeof e.Current == 'number') {
                    var max = e.Current;
                    while (e.MoveNext()) {
                        if (max < e.Current)
                            max = e.Current;
                    }
                } else
                    throw new Error('Invalid type given, expected number. Please extract the correct value.');
            } else {
                if (e.Current == undefined)
                    return null;
                var maxObj = e.Current;
                var maxNum = extractor(e.Current);
                while (e.MoveNext()) {
                    var num = extractor(e.Current);
                    if (maxNum < num) {
                        maxNum = num;
                        maxObj = e.Current;
                    }
                }
                return maxObj;
            }
        };

        Enumerable.prototype.CountAll = function (predictate) {
            var e = this.GetEnumerator();
            if (predictate == undefined) {
                if (this instanceof Collection) {
                    return this.Count;
                } else {
                    var c = 0;
                    do {
                        c++;
                    } while(e.MoveNext());
                    return c;
                }
            } else {
                var c = 0;
                do {
                    if (predictate(e.Current))
                        c++;
                } while(e.MoveNext());
                return c;
            }
        };

        Enumerable.prototype.ToList = function () {
            var e = this.GetEnumerator();
            var l = new Collections.List();
            do {
                l.Add(e.Current);
            } while(e.MoveNext());
            return l;
        };

        Enumerable.prototype.ToArray = function () {
            var e = this.GetEnumerator();
            var l = [];
            while (e.MoveNext()) {
                l[l.length] = e.Current;
            }
            return l;
        };

        Enumerable.prototype.ToDictionary = function (keyExtractor, valueExtractor, dict) {
            var e = this.GetEnumerator();
            if (dict == undefined)
                var dict = new Collections.Dictionary();
            while (e.MoveNext()) {
                dict.Set(keyExtractor(e.Current), valueExtractor(e.Current));
            }
            return dict;
        };

        Enumerable.CopyToArray = function (e) {
            return this.EnumerateToArray(e.GetEnumerator());
        };

        Enumerable.EnumerateToArray = function (e) {
            var r = [];
            if (!e.IsValid())
                return r;
            do {
                r.push(e.Current);
            } while(e.MoveNext());
            return r;
        };

        Enumerable.prototype.GetEnumerator = function () {
            throw new Error('This method is abstract, and should therefore be overridden by the extending class.');
        };
        return Enumerable;
    })();
    Collections.Enumerable = Enumerable;

    // Does the same as an enumerable, but extends the functionality and makes
    var Collection = (function (_super) {
        __extends(Collection, _super);
        function Collection() {
            _super.apply(this, arguments);
        }
        Collection.prototype.Add = function (item) {
            throw new NotImplementedException();
        };
        Collection.prototype.Clear = function () {
            throw new NotImplementedException();
        };
        Collection.prototype.Contains = function (item) {
            throw new NotImplementedException();
        };
        Collection.prototype.Remove = function (item) {
            throw new NotImplementedException();
        };
        Collection.prototype.CopyTo = function (collection) {
            throw new NotImplementedException();
        };
        Collection.prototype.GetNative = function () {
            throw new NotImplementedException();
        };

        /**
        * Remove all items in this collection that satisfy the given predictate.
        */
        Collection.prototype.RemoveAll = function (predictate) {
            var e = this.GetEnumerator();
            var c = 0;
            if (!e.IsValid())
                return c;
            do {
                if (predictate(e.Current)) {
                    this.Remove(e.Current);
                    c++;
                }
            } while(e.MoveNext());
            return c;
        };

        /**
        * Remove the first item that satisfies the given predictate.
        */
        Collection.prototype.RemoveFirst = function (predictate) {
            var e = this.GetEnumerator();
            if (!e.IsValid())
                return;
            do {
                if (predictate(e.Current)) {
                    this.Remove(e.Current);
                    return;
                }
            } while(e.MoveNext());
        };
        return Collection;
    })(Enumerable);
    Collections.Collection = Collection;
})(Collections || (Collections = {}));
/// <reference path="Enumerable.ts" />
var Collections;
(function (Collections) {
    var Pair = (function (_super) {
        __extends(Pair, _super);
        function Pair(Value1, Value2) {
            _super.call(this);
            this.Value1 = Value1;
            this.Value2 = Value2;
        }
        return Pair;
    })(BaseObject);
    Collections.Pair = Pair;
    var Tuple = (function (_super) {
        __extends(Tuple, _super);
        function Tuple(Value1, Value2, Value3) {
            _super.call(this);
            this.Value1 = Value1;
            this.Value2 = Value2;
            this.Value3 = Value3;
        }
        return Tuple;
    })(BaseObject);
    Collections.Tuple = Tuple;
    var Quadruple = (function (_super) {
        __extends(Quadruple, _super);
        function Quadruple(Value1, Value2, Value3, Value4) {
            _super.call(this);
            this.Value1 = Value1;
            this.Value2 = Value2;
            this.Value3 = Value3;
            this.Value4 = Value4;
        }
        return Quadruple;
    })(BaseObject);
    Collections.Quadruple = Quadruple;
    var Pentuple = (function (_super) {
        __extends(Pentuple, _super);
        function Pentuple(Value1, Value2, Value3, Value4, Value5) {
            _super.call(this);
            this.Value1 = Value1;
            this.Value2 = Value2;
            this.Value3 = Value3;
            this.Value4 = Value4;
            this.Value5 = Value5;
        }
        return Pentuple;
    })(BaseObject);
    Collections.Pentuple = Pentuple;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var ArrayHelper = (function () {
        function ArrayHelper() {
        }
        ArrayHelper.GetEnumerator = function (arr) {
            if (arr == undefined)
                throw new InvalidArgumentException();
            return new Collections.SimpleEnumerator(arr);
        };
        return ArrayHelper;
    })();
    Collections.ArrayHelper = ArrayHelper;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    /**
    * Real standalone list implementation.
    */
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            _super.apply(this, arguments);
            this._length = 0;
        }
        Object.defineProperty(List.prototype, "Count", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });

        List.prototype.Add = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            this[this._length] = item;
            this._length++;
        };

        List.prototype.AddRange = function (collection) {
            if (collection === undefined)
                throw new InvalidArgumentException();
            var e = collection.GetEnumerator();
            if (e.Current != undefined)
                do {
                    this.Add(e.Current);
                } while(e.MoveNext());
        };

        List.prototype.Remove = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            var minus = 0;
            for (var i = 0; i < this._length; i++) {
                if (item == this[i]) {
                    delete this[i];
                    minus++;
                }
            }
            if (minus > 0) {
                this._fixIndex();
                //this._length -= minus;
            } else
                throw new KeyNotFoundException();
        };

        List.prototype.Clear = function () {
            for (var i = 0; i < this._length; i++) {
                delete this[i];
            }
            this._length = 0;
        };

        List.prototype.Contains = function (item) {
            for (var i = 0; i < this._length; i++) {
                if (item == this[i])
                    return true;
            }
            return false;
        };

        List.prototype.IndexOf = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            for (var i = 0; i < this._length; i++) {
                if (item == this[i])
                    return i;
            }
            return -1;
        };

        List.prototype.ElementAt = function (index) {
            if (index === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index >= this._length)
                throw new IndexOutOfBoundsException();
            return this[index];
        };

        List.prototype.Insert = function (index, item) {
            if (index === undefined || item === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index > this._length)
                throw new IndexOutOfBoundsException();

            this._makeGap(index, 1);
            this[index] = item;
        };

        List.prototype.InsertRange = function (index, collection) {
            if (index === undefined || collection == undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index > this._length)
                throw new IndexOutOfBoundsException();

            var elements = Collections.Enumerable.CopyToArray(collection);
            this._makeGap(index, elements.length);
            for (var i = 0; i < elements.length; i++) {
                this[i] = elements[i];
            }
        };

        List.prototype.RemoveAt = function (index) {
            if (index === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index >= this._length)
                throw new IndexOutOfBoundsException();

            delete this[index];
            this._fixIndex();
        };

        List.prototype.RemoveRange = function (index, count) {
            if (index === undefined || count === undefined)
                throw new InvalidArgumentException();
            if ((index < 0 || index >= this._length) || (count < 0 || count > (this._length - index)))
                throw new IndexOutOfBoundsException();

            for (var i = 0; i < count; i++)
                delete this[index + i];

            this._fixIndex();
        };

        List.prototype.CopyTo = function (collection) {
            for (var i = 0; i < this._length; i++) {
                collection.Add(this[i]);
            }
        };

        List.prototype.GetEnumerator = function () {
            return new ListEnumerator(this);
        };

        /**
        * This is a native (It is natively implemented as an object) so this just returns this object :)
        */
        List.prototype.GetNative = function () {
            return this;
        };

        /**
        * This makes sure that there are no gaps between indices after altering the elements in a list.
        */
        List.prototype._fixIndex = function () {
            var removed = 0;
            var removalStart = -1;
            var total = this._length;
            for (var i = 0; i < total; i++) {
                if (this[i] === undefined && this[i + 1] === undefined) {
                    if (removalStart >= 0)
                        continue;
                    else
                        removalStart = i;
                } else if (removalStart >= 0 && this[i] !== undefined) {
                    var rem = this._removeGap(removalStart, (i - 1));
                    removed += rem;
                    total -= rem;
                    removalStart = -1;
                } else if (removalStart == -1 && this[i] === undefined) {
                    var rem = this._removeGap(i, i);
                    total -= rem;
                    removed += rem;
                }
            }
            if (removalStart > -1)
                removed += this._length - removalStart;
            this._length -= removed;
        };

        List.prototype._removeGap = function (gapStart, gapEnd) {
            // fill gap
            var gapSize = (gapEnd - gapStart) + 1;
            var gapPos = 1;
            for (var i = gapStart; i < this._length; i++) {
                this[i] = this[gapEnd + gapPos];
                gapPos++;
            }

            for (var r = this._length - gapSize; r < this._length; r++) {
                delete this[r];
            }

            return gapSize;
        };

        List.prototype._makeGap = function (gapStart, gapLength) {
            // Copy values after gapStart to object an delete originals
            var tmp = {};
            for (var i = 0; i < (this._length - gapStart); i++) {
                tmp[i] = this[gapStart + i];
                delete this[gapStart + i];
            }

            for (var i = 0; i < (this._length - gapStart); i++) {
                this[gapStart + gapLength + i] = tmp[i];
            }
            this._length += gapLength;
        };
        return List;
    })(Collections.Collection);
    Collections.List = List;

    var ListEnumerator = (function () {
        function ListEnumerator(list) {
            this.Index = 0;
            if (list == undefined || list == null)
                throw new InvalidArgumentException();
            this.List = list;
        }
        Object.defineProperty(ListEnumerator.prototype, "Current", {
            get: function () {
                return this.List[this.Index];
            },
            enumerable: true,
            configurable: true
        });

        ListEnumerator.prototype.MoveNext = function () {
            if (!this.HasNext())
                return false;
            this.Index++;
            return true;
        };

        ListEnumerator.prototype.HasNext = function () {
            return (this.Index + 1 < this.List.Count);
        };

        ListEnumerator.prototype.IsValid = function () {
            return (this.Index < this.List.Count);
        };

        ListEnumerator.prototype.Reset = function () {
            this.Index = 0;
        };
        return ListEnumerator;
    })();
    Collections.ListEnumerator = ListEnumerator;

    /**
    * List implementation based on an real array.
    */
    var ArrayList = (function (_super) {
        __extends(ArrayList, _super);
        function ArrayList() {
            _super.apply(this, arguments);
            /**
            * @access protected
            */
            this.Items = [];
        }
        Object.defineProperty(ArrayList.prototype, "Count", {
            get: function () {
                return this.Items.length;
            },
            enumerable: true,
            configurable: true
        });

        ArrayList.prototype.Add = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            this.Items.push(item);
        };

        ArrayList.prototype.AddRange = function (collection) {
            if (collection === undefined)
                throw new InvalidArgumentException();
            this.Items = this.Items.concat(Collections.Enumerable.CopyToArray(collection));
        };

        ArrayList.prototype.Remove = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            var removed = false;
            for (var i = 0; i < this.Items.length; i++) {
                if (item == this.Items[i]) {
                    this.Items.splice(i, 1);
                    removed = true;
                }
            }
            if (!removed)
                throw new KeyNotFoundException();
        };

        ArrayList.prototype.RemoveRange = function (index, count) {
            if (index === undefined || count === undefined)
                throw new InvalidArgumentException();
            if ((index < 0 || index >= this.Items.length) || (count < 0 || count > (this.Items.length - index)))
                throw new IndexOutOfBoundsException();
            this.Items.splice(index, count);
        };

        ArrayList.prototype.Clear = function () {
            this.Items = [];
        };

        ArrayList.prototype.Contains = function (item) {
            return (this.Items.indexOf(item) >= 0);
        };

        ArrayList.prototype.IndexOf = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();

            return this.Items.indexOf(item);
        };

        ArrayList.prototype.ElementAt = function (index) {
            if (index === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index >= this.Items.length)
                throw new IndexOutOfBoundsException();

            return this.Items[index];
        };

        ArrayList.prototype.Insert = function (index, item) {
            if (index === undefined || item === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index > this.Items.length)
                throw new IndexOutOfBoundsException();

            this.Items.splice(index, 0, item);
        };

        ArrayList.prototype.InsertRange = function (index, collection) {
            if (index === undefined || collection == undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index > this.Items.length)
                throw new IndexOutOfBoundsException();

            var sliceAfter = this.Items.slice(index);
            var sliceBefore = this.Items;
            this.Items = sliceBefore.concat(Collections.Enumerable.CopyToArray(collection)).concat(sliceAfter);
        };

        ArrayList.prototype.RemoveAt = function (index) {
            if (index === undefined)
                throw new InvalidArgumentException();
            if (index < 0 || index >= this.Items.length)
                throw new IndexOutOfBoundsException();

            this.Items.splice(index, 1);
        };

        ArrayList.prototype.CopyTo = function (collection) {
            for (var i = 0; i < this.Items.length; i++) {
                collection.Add(this.Items[i]);
            }
        };

        ArrayList.prototype.GetEnumerator = function () {
            return new Collections.SimpleEnumerator(this.Items);
        };

        ArrayList.prototype.GetNative = function () {
            return this.Items;
        };
        return ArrayList;
    })(Collections.Collection);
    Collections.ArrayList = ArrayList;
})(Collections || (Collections = {}));
/// <reference path="Collection.ts" />
/// <reference path="Enumerable.ts" />
/// <reference path="../../defs/lodash.d.ts" />
var Collections;
(function (Collections) {
    // Stores key/value pairs as objects, like in C#, good for storage in JS, very bad for search.
    var Dictionary = (function (_super) {
        __extends(Dictionary, _super);
        function Dictionary() {
            _super.apply(this, arguments);
            this.Items = [];
        }
        Object.defineProperty(Dictionary.prototype, "Count", {
            get: function () {
                return this.Items.length;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Dictionary.prototype, "Keys", {
            get: function () {
                //return _.pluck(this.Items, 'Key');
                var keys = [];
                var i = 0;
                var l = this.Items.length;
                while (i < l)
                    keys[keys.length] = this.Items[i].Key;
                return keys;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Dictionary.prototype, "Values", {
            get: function () {
                //return _.pluck(this.Items, 'Value');
                var values = [];
                var i = 0;
                var l = this.Items.length;
                while (i < l)
                    values[values.length] = this.Items[i].Value;
                return values;
            },
            enumerable: true,
            configurable: true
        });

        Dictionary.prototype.Get = function (key) {
            var i = 0;
            var l = this.Items.length;
            while (i < l) {
                if (this.Items[i].Key == key)
                    return this.Items[i].Value;
            }
            return null;
        };

        Dictionary.prototype.Set = function (key, value) {
            var i = 0;
            var l = this.Items.length;
            while (i < l) {
                if (this.Items[i].Key == key)
                    this.Items[i].Value = value;
            }
            this.Add(new KeyValuePair(key, value));
        };

        Dictionary.prototype.Add = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            if (item == null) {
                this.Items.push(new KeyValuePair(null, null));
                console.warn('It probably isn\'t smart to add Null values to a Dictionary. Maybe you\'d want to change your application to check for those kinds of values?');
            } else
                this.Items.push(item);
        };

        Dictionary.prototype.GetKey = function (value) {
            var i = 0;
            var l = this.Items.length;
            while (i < l) {
                if (this.Items[i].Value == value)
                    return this.Items[i].Key;
            }
            return null;
        };

        Dictionary.prototype.Clear = function () {
            this.Items = [];
        };

        Dictionary.prototype.Contains = function (item) {
            for (var i = 0; i < this.Items.length; i++) {
                if (item == this.Items[i])
                    return true;
            }
            return false;
        };

        Dictionary.prototype.ContainsKey = function (key) {
            for (var i = 0; i < this.Items.length; i++) {
                if (key == this.Items[i].Key)
                    return true;
            }
            return false;
        };

        Dictionary.prototype.Remove = function (obj) {
            if (obj === undefined)
                throw new InvalidArgumentException();
            var removed = false;
            if (obj instanceof KeyValuePair) {
                for (var i = 0; i < this.Items.length; i++) {
                    if (this.Items[i] == obj) {
                        this.Items.splice(i, 1);
                        removed = true;
                    }
                }
            } else {
                for (var i = 0; i < this.Items.length; i++) {
                    if (this.Items[i].Key == obj) {
                        this.Items.splice(i, 1);
                        removed = true;
                    }
                }
            }
            if (!removed)
                throw new KeyNotFoundException();
        };

        Dictionary.prototype.CopyTo = function (collection) {
            for (var i = 0; i < this.Items.length; i++) {
                collection.Add(this.Items[i]);
            }
        };

        Dictionary.prototype.GetNative = function () {
            return this.Items;
        };

        Dictionary.prototype.GetEnumerator = function () {
            return new DictionaryEnumerator(this.Items);
        };
        return Dictionary;
    })(Collections.Collection);
    Collections.Dictionary = Dictionary;

    // More limited in what it can store than a storage dictionary but much faster due to it's use of native arrays and thu faster when using direct acces, but still has all the extended properties.
    var SearchDictionary = (function (_super) {
        __extends(SearchDictionary, _super);
        function SearchDictionary() {
            _super.apply(this, arguments);
            this._count = 0;
            this.Items = {};
        }
        Object.defineProperty(SearchDictionary.prototype, "Count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SearchDictionary.prototype, "Keys", {
            get: function () {
                return this.Items.Keys();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(SearchDictionary.prototype, "Values", {
            get: function () {
                return _.values(this.Items);
            },
            enumerable: true,
            configurable: true
        });

        SearchDictionary.prototype.Get = function (key) {
            return this.Items[key];
        };

        SearchDictionary.prototype.Set = function (key, value) {
            if (this.Items[key] === undefined) {
                this.Items[key] = value;
                this._count++;
            } else {
                this.Items[key] = value;
            }
        };

        SearchDictionary.prototype.Add = function (item) {
            if (item === undefined)
                throw new InvalidArgumentException();
            if (item == null) {
                //this.Items[''] = null;
                console.warn('It probably isn\'t smart to add Null values to a Dictionary. Maybe you\'d want to change your application to check for those kinds of values?');
            } else
                this.Items[item.Key] = item.Value;
            this._count++;
        };

        SearchDictionary.prototype.GetKey = function (value) {
            for (var prop in this.Items) {
                if (this.Items[prop] == value)
                    return prop;
            }
        };

        SearchDictionary.prototype.Clear = function () {
            this.Items = {};
            this._count = 0;
        };

        SearchDictionary.prototype.Contains = function (item) {
            for (var key in this.Items) {
                if (key == item.Key && this.Items[key] == item.Value)
                    return true;
            }
            return false;
        };

        SearchDictionary.prototype.ContainsKey = function (key) {
            return (key in this.Items);
        };

        SearchDictionary.prototype.Remove = function (obj) {
            if (obj === undefined)
                throw new InvalidArgumentException();
            var removed = false;
            if (obj instanceof KeyValuePair) {
                for (var key in this.Items) {
                    if (key == obj.Key && this.Items[key] == obj.Value) {
                        delete this.Items[key];
                        this._count--;
                        removed = true;
                    }
                }
            } else {
                for (var key in this.Items) {
                    if (this.Items[key] == obj) {
                        delete this.Items[key];
                        this._count--;
                        removed = true;
                    }
                }
            }
            if (!removed)
                throw new KeyNotFoundException();
        };

        SearchDictionary.prototype.CopyTo = function (collection) {
            for (var key in this.Items)
                collection.Add(new KeyValuePair(key, this.Items[key]));
        };

        SearchDictionary.prototype.GetNative = function () {
            return this.Items;
        };

        SearchDictionary.prototype.GetEnumerator = function () {
            return new SearchDictionaryEnumerator(this.Items);
        };
        return SearchDictionary;
    })(Collections.Collection);
    Collections.SearchDictionary = SearchDictionary;

    // Key value pair container, simplest of objects in TypeScript
    var KeyValuePair = (function () {
        function KeyValuePair(Key, Value) {
            this.Key = Key;
            this.Value = Value;
        }
        return KeyValuePair;
    })();
    Collections.KeyValuePair = KeyValuePair;

    // Internal base enumerator class (Must be exported because the other class extends it, apparently)
    var BaseDictionaryEnumerator = (function () {
        function BaseDictionaryEnumerator() {
            this._index = 0;
        }
        Object.defineProperty(BaseDictionaryEnumerator.prototype, "Index", {
            get: function () {
                return this._index;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BaseDictionaryEnumerator.prototype, "Current", {
            get: function () {
                throw new AbstractMethodException();
            },
            enumerable: true,
            configurable: true
        });

        BaseDictionaryEnumerator.prototype.HasNext = function () {
            throw new AbstractMethodException();
        };

        BaseDictionaryEnumerator.prototype.IsValid = function () {
            throw new AbstractMethodException();
        };

        BaseDictionaryEnumerator.prototype.MoveNext = function () {
            if (!this.HasNext())
                return false;
            this._index++;
            this.RefreshCurrent();
            return true;
        };

        BaseDictionaryEnumerator.prototype.Reset = function () {
            this._index = 0;
            this.RefreshCurrent();
        };

        BaseDictionaryEnumerator.prototype.RefreshCurrent = function () {
            throw new AbstractMethodException();
        };
        return BaseDictionaryEnumerator;
    })();
    Collections.BaseDictionaryEnumerator = BaseDictionaryEnumerator;

    // Dictionary Iterator
    var DictionaryEnumerator = (function (_super) {
        __extends(DictionaryEnumerator, _super);
        function DictionaryEnumerator(items) {
            _super.call(this);
            if (items == undefined || items == null)
                throw new InvalidArgumentException();
            this.Items = items;
            this.RefreshCurrent();
        }
        Object.defineProperty(DictionaryEnumerator.prototype, "Current", {
            get: function () {
                return this.Items[this.Index];
            },
            enumerable: true,
            configurable: true
        });

        DictionaryEnumerator.prototype.HasNext = function () {
            return (this.Index + 1 < this.Items.length);
        };

        DictionaryEnumerator.prototype.IsValid = function () {
            return (this.Index < this.Items.length);
        };

        DictionaryEnumerator.prototype.RefreshCurrent = function () {
            if (this.Items.length > 0) {
                this.Key = this.Current.Key;
                this.Value = this.Current.Value;
            }
        };
        return DictionaryEnumerator;
    })(BaseDictionaryEnumerator);
    Collections.DictionaryEnumerator = DictionaryEnumerator;

    // Optimized iterator for searchdictionary
    var SearchDictionaryEnumerator = (function (_super) {
        __extends(SearchDictionaryEnumerator, _super);
        function SearchDictionaryEnumerator(items) {
            _super.call(this);
            if (items == undefined || items == null)
                throw new InvalidArgumentException();
            this.Items = items;
            this.Keys = _.keys(this.Items);
            this.RefreshCurrent();
        }
        Object.defineProperty(SearchDictionaryEnumerator.prototype, "Current", {
            get: function () {
                if (this.Keys.length > 0)
                    return new KeyValuePair(this.Key, this.Value);
                return undefined;
            },
            enumerable: true,
            configurable: true
        });

        SearchDictionaryEnumerator.prototype.HasNext = function () {
            return !(this.Keys[this.Index + 1] == undefined);
        };

        SearchDictionaryEnumerator.prototype.IsValid = function () {
            return !(this.Keys[this.Index] == undefined);
        };

        SearchDictionaryEnumerator.prototype.RefreshCurrent = function () {
            if (this.Keys.length > 0) {
                this.Key = this.Keys[this.Index];
                this.Value = this.Items[this.Keys[this.Index]];
            }
        };
        return SearchDictionaryEnumerator;
    })(BaseDictionaryEnumerator);
    Collections.SearchDictionaryEnumerator = SearchDictionaryEnumerator;
})(Collections || (Collections = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Enumerable.ts" />
/// <reference path="Linq.ts" />
/// <reference path="Collection.ts" />
/// <reference path="Tuple.ts" />
/// <reference path="Array.ts" />
/// <reference path="List.ts" />
/// <reference path="Dictionary.ts" />
/// <reference path="../Collections/Dictionary.ts" />
/// <reference path="../Collections/List.ts" />
/// <reference path="../BaseObject.ts" />
var Events;
(function (Events) {
    

    

    

    /**
    * Simple Implementation, only works with EventDispatcher extending objects
    */
    var ObjectEvent = (function () {
        function ObjectEvent(_originatingObject, _eventName, _data) {
            if (typeof _data === "undefined") { _data = {}; }
            this._originatingObject = _originatingObject;
            this._eventName = _eventName;
            this._data = _data;
        }
        Object.defineProperty(ObjectEvent.prototype, "EventName", {
            get: function () {
                return this._eventName;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ObjectEvent.prototype, "OriginatingObject", {
            get: function () {
                return this._originatingObject;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ObjectEvent.prototype, "Data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });

        ObjectEvent.prototype.StopPropagation = function () {
            this._originatingObject.StopCurrentEventPropagation();
        };
        return ObjectEvent;
    })();
    Events.ObjectEvent = ObjectEvent;

    /**
    * Basic Implementation of an IEventDispatcher
    * @abstract
    */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.apply(this, arguments);
            this.EventConsumers = new Collections.Dictionary();
            this.EventDelegates = new Collections.Dictionary();
            this.PropagationCanceled = false;
        }
        /**
        * Trigger an object event.
        */
        EventDispatcher.prototype.Dispatch = function (eventName, event) {
            var _this = this;
            this.PropagationCanceled = false; // Ignore any canceling

            // Consumers
            if (this.EventConsumers.Count > 0) {
                this.EventConsumers.Where(function (eventConsumer) {
                    return eventConsumer.Key == eventName || eventConsumer.Key == EventDispatcher.WildcardEvent;
                }).BreakableEach(function (eventConsumer) {
                    if (_this.PropagationCanceled == true)
                        return false;
                    eventConsumer.Value.BreakableEach(function (eventConsumer) {
                        if (_this.PropagationCanceled == true) {
                            //this.PropagationCanceled = false; // now gets done at the end, so consumer events can also cancel delegated event handlers.
                            return false;
                        }
                        eventConsumer.ConsumeEvent(event);
                    });
                });
            }

            // Simple delegates
            if (this.EventDelegates.Count > 0 && this.PropagationCanceled == false) {
                this.EventDelegates.Where(function (eventDelegate) {
                    return eventDelegate.Key == eventName || eventDelegate.Key == EventDispatcher.WildcardEvent;
                }).BreakableEach(function (eventDelegate, qr) {
                    eventDelegate.Value.BreakableEach(function (eventDelegate) {
                        if (_this.PropagationCanceled == true)
                            return false;
                        eventDelegate(event);
                    });
                    if (_this.PropagationCanceled == true) {
                        _this.PropagationCanceled = false;
                        return false;
                    }
                });
            }
        };

        /**
        * Add consumer
        */
        EventDispatcher.prototype.Consume = function (consumer, events) {
            var _this = this;
            if (consumer.ConsumeEvent == undefined) {
                throw new Error('Invalid consumer object given');
            }
            if (events == undefined)
                events = [EventDispatcher.WildcardEvent];
            _.each(events, function (item) {
                if (!_this.EventConsumers.ContainsKey(item))
                    _this.EventConsumers.Set(item, new Collections.List());
                _this.EventConsumers.Get(item).Add(consumer);
            });
        };

        /**
        * Remove consumer
        */
        EventDispatcher.prototype.Starve = function (consumer, events) {
            var _this = this;
            if (events == undefined) {
                this.EventConsumers.Each(function (item) {
                    item.Value.Remove(consumer);
                });
            } else {
                _.each(events, function (item) {
                    if (_this.EventConsumers.ContainsKey(item))
                        _this.EventConsumers.Get(item).Remove(consumer);
                });
            }
        };

        /**
        * Register a single callback for a single event
        */
        EventDispatcher.prototype.Attach = function (callback, events) {
            var _this = this;
            if (events == undefined)
                events = [EventDispatcher.WildcardEvent];
            _.each(events, function (item) {
                if (!_this.EventDelegates.ContainsKey(item))
                    _this.EventDelegates.Set(item, new Collections.List());
                _this.EventDelegates.Get(item).Add(callback);
            });
        };

        /**
        * Remove an attached event
        */
        EventDispatcher.prototype.Detach = function (callback, events) {
            throw new NotImplementedException();
        };

        /**
        * Shorthand for Attach, use exectly like the jQuery exuivalent
        * Eventnames is a space separated list of events to bind.
        */
        EventDispatcher.prototype.On = function (eventNames, callback) {
            var events = eventNames.split(' ');
            this.Attach(callback, events);
        };

        /**
        * Stop the current event cycle from bubling further down the attached events.
        */
        EventDispatcher.prototype.StopCurrentEventPropagation = function () {
            this.PropagationCanceled = true;
        };
        EventDispatcher.WildcardEvent = '*';
        return EventDispatcher;
    })(BaseObject);
    Events.EventDispatcher = EventDispatcher;

    /**
    * Copies the Event Dispatcher methods to the class, so we can work around the single inheritance limitation.
    * IMPOTANT!: Also call this.InitEventSystem() in the constructor.
    */
    function CopyEventDispatcherPrototype(eventDispatcherImpl) {
        // ------------ COPY PROTOTYPE --------------
        // Because im not really gonna copy and paste the entire event class, but I /do/ want multiple inheritance im gnna copy them to thi class's prototype.
        eventDispatcherImpl.prototype.InitEventSystem = function () {
            this.EventConsumers = new Collections.Dictionary();
            this.EventDelegates = new Collections.Dictionary();
            this.PropagationCanceled = false;
        };
        eventDispatcherImpl.prototype.Dispatch = EventDispatcher.prototype.Dispatch;
        eventDispatcherImpl.prototype.Consume = EventDispatcher.prototype.Consume;
        eventDispatcherImpl.prototype.Starve = EventDispatcher.prototype.Starve;
        eventDispatcherImpl.prototype.Attach = EventDispatcher.prototype.Attach;
        eventDispatcherImpl.prototype.Detach = EventDispatcher.prototype.Detach;
        eventDispatcherImpl.prototype.On = EventDispatcher.prototype.On;
        eventDispatcherImpl.prototype.StopCurrentEventPropagation = EventDispatcher.prototype.StopCurrentEventPropagation;
    }
    Events.CopyEventDispatcherPrototype = CopyEventDispatcherPrototype;
})(Events || (Events = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Events.ts" />
/// <reference path="../Events/Events.ts" />
var Model;
(function (Model) {
    // Simple model event object
    var ModelEvent = (function (_super) {
        __extends(ModelEvent, _super);
        function ModelEvent() {
            _super.apply(this, arguments);
        }
        return ModelEvent;
    })(Events.ObjectEvent);

    // Lazy loading viewmodel
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(url, options) {
            if (typeof options === "undefined") { options = {}; }
            _super.call(this);
            this._modelAttributes = [];
            this._modelValues = null;
            this._modelDefaults = null;
            this._hasFetched = false;
            this._modelUrl = url;
            if (options !== undefined && options !== null)
                this._options = options;
            else
                this._options = {};
        }
        // Iterates over all user added properties and changes them to dynamic getters and setters, so sync and save are no longer required.
        // This is pretty cool stuff :)
        ViewModel.prototype.RefreshModelProperties = function (exclusionList) {
            var _this = this;
            if (typeof exclusionList === "undefined") { exclusionList = []; }
            this._modelDefaults = {};
            this._modelValues = {};

            var blacklist = [
                'EventConsumers',
                'EventDelegates',
                'PropagationCanceled'
            ].concat(exclusionList);

            var properties = Object.getOwnPropertyNames(this);
            _.each(properties, function (value, key) {
                if (value.substr(0, 1) != '_' && blacklist.indexOf(value) == -1) {
                    _this._modelDefaults[value] = _this[value];
                    _this._modelValues[value] = _this[value];
                    Object.defineProperty(_this, value, {
                        get: function () {
                            return _this.TryGet.bind(_this)(value);
                        },
                        set: function (newval) {
                            _this.Set.bind(_this)(value, newval);
                        },
                        enumerable: true,
                        configurable: true
                    });
                }
            });
            console.log(this._modelValues);
        };

        // Identifier property if any, or null (No exceptions)
        ViewModel.prototype.GetID = function () {
            if (this._options.idProperty == undefined) {
                if (_.contains(this._modelAttributes, 'id'))
                    return this._modelValues['id'];
                else
                    return null;
            } else
                return this.SafeGet(this._options.idProperty);
        };

        // Will not try fetch the property if it isnt fetched yet
        ViewModel.prototype.SafeGet = function (name) {
            if (this._modelValues[name])
                return this._modelValues[name];
            else if (this._modelValues[this.UCFirst(name)] !== undefined)
                return this._modelValues[this.UCFirst(name)];
            return undefined;
        };

        ViewModel.prototype.Get = function (name) {
            if (this._modelValues == null)
                this.Fetch(false);
            if (this._modelValues[name])
                return this._modelValues[name];
            else if (this._modelValues[this.UCFirst(name)] !== undefined)
                return this._modelValues[this.UCFirst(name)];
            return undefined;
        };

        ViewModel.prototype.TryGet = function (name) {
            if (this._modelValues == null)
                this.Fetch(false);
            if (this._modelValues[name])
                return this._modelValues[name];
            else if (this._modelValues[this.UCFirst(name)] !== undefined)
                return this._modelValues[this.UCFirst(name)];
            else
                throw new Error('Attribute "' + this.UCFirst(name) + '" doesn\'t exist on ViewModel ' + this.GetType().Name);
        };

        // Get multiple properties when they're available
        ViewModel.prototype.AsyncGetAttributes = function (attributes, success) {
            var _this = this;
            if (this._modelValues == null)
                this.Fetch(true, null, function () {
                    success(_.pick(_this._modelValues, attributes));
                });
            else
                success(_.pick(this._modelValues, attributes));
        };

        // Set the value of an value.
        ViewModel.prototype.Set = function (name, value, preventEvent) {
            if (typeof preventEvent === "undefined") { preventEvent = false; }
            if (preventEvent != true)
                this.Dispatch('set', new ModelEvent(this, 'set', {
                    name: name,
                    oldValue: this._modelValues[name],
                    newValue: value
                }));
            this._modelValues[name] = value;
            if (preventEvent != true)
                this.Dispatch('change', new ModelEvent(this, 'change', this._modelValues));
        };

        // fetch all data from the server for this viewmodel. (Success callback only gets executed on async requests!)
        ViewModel.prototype.Fetch = function (async, options, success) {
            var _this = this;
            if (typeof async === "undefined") { async = true; }
            if (async === false) {
                console.log('Fetching model ' + this.GetType().Name + ' synchronously from ' + this._modelUrl);
                $.ajax({
                    dataType: "json",
                    url: this._modelUrl,
                    async: false,
                    data: (options && options.data) ? _.merge({ id: this.GetID() }, options.data) : { id: this.GetID() },
                    success: function (jsonObj) {
                        _this._hasFetched = true;

                        _this._modelValues = jsonObj;
                        _this.Dispatch('fetch', new ModelEvent(_this, 'fetch', _this._modelValues));
                        _this.Dispatch('change', new ModelEvent(_this, 'change', _this._modelValues));
                    }
                });
            } else if (async === true) {
                console.log('Fetching model ' + this.GetType().Name + ' synchronously from ' + this._modelUrl);
                jQuery.getJSON(this._modelUrl, (options && options.data) ? _.merge({ id: this.GetID() }, options.data) : { id: this.GetID() }, function (jsonObj) {
                    _this._hasFetched = true;

                    _this._modelValues = jsonObj;
                    _this.Dispatch('fetch', new ModelEvent(_this, 'fetch', _this._modelValues));
                    _this.Dispatch('change', new ModelEvent(_this, 'change', _this._modelValues));
                    success(_this);
                });
            }
        };

        ViewModel.prototype.Save = function () {
            throw new Error('Not implemented');
        };
        ViewModel.prototype.Sync = function () {
            throw new Error('Not implemented');
        };

        /**
        * Gives you a plain object snapshot of the current values of the model without any event listeners etc, etc.
        * Example of usage: For lodash or underscore templates or other places where u use a "with() {}" construct.
        */
        ViewModel.prototype.ToObject = function () {
            // Try and fetch model:
            return jQuery.extend({}, this._modelValues);
        };

        ViewModel.prototype.UCFirst = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        return ViewModel;
    })(Events.EventDispatcher);
    Model.ViewModel = ViewModel;
})(Model || (Model = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Model.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="../../defs/jquery.d.ts" />
/// <reference path="../../defs/lodash.d.ts" />
/// <reference path="../TemplateFactory.ts" />
var Panels;
(function (Panels) {
    

    /**
    * Panel Object
    *
    * Represents a subset of an application interface.
    * @abstract
    */
    var Panel = (function (_super) {
        __extends(Panel, _super);
        /**
        * @abstract
        */
        function Panel() {
            _super.call(this);
            /**
            * The sequential/internal identifier of this panel.
            */
            this._panelId = -1;
            /**
            * The (Given) name of this panel.
            */
            this._panelName = null;
            this._panelId = Panel._panelCnt++;
            this._panelElement = jQuery('<div class="view-panel" id="' + this.PanelName + '">');
            this._contentElement = this._panelElement;
        }
        Object.defineProperty(Panel.prototype, "PanelName", {
            /**
            * Get the name of the panel.
            */
            get: function () {
                return this._panelName ? this._panelName : 'panel' + this._panelId;
            },
            /**
            * Set the name of this panel.
            * WARNING: Do not change the name of a panel AFTER it ha been added to a group!!
            */
            set: function (name) {
                this._panelName = name;
                this.PanelElement.attr('id', name);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Panel.prototype, "PanelSeqId", {
            /**
            * Get the unique identifier of this panel. (Unmodifyable)
            */
            get: function () {
                return this._panelId;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Panel.prototype, "PanelElement", {
            /**
            * Get the panel's outermost element.
            *
            * Use this element to move the entire Panel through the DOM.
            */
            get: function () {
                return this._panelElement;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Panel.prototype, "ContentElement", {
            /**
            * Get the panle's innermost element.
            *
            * Use this element to add/alter/remove content inside the Panel.
            */
            get: function () {
                return this._contentElement;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Render the panel so it will be displayed.
        */
        Panel.prototype.Render = function () {
            this.Renderer();
        };

        /**
        * This is the method the panel implementation will overwrite.
        * Please do not directly call this method unless you know what you are doing.
        * @abstract
        * @access protected
        */
        Panel.prototype.Renderer = function () {
            throw new AbstractMethodException();
        };

        /**
        * Asynchronusly retrieve an template to work with.
        */
        Panel.prototype.withTemplate = function (name, callback) {
            TemplateFactory.WithTemplate(name, callback.bind(this));
        };

        /**
        * Synchronously retrieve an compiled template.
        */
        Panel.prototype.GetTemplate = function (name) {
            return TemplateFactory.GetTemplate(name);
        };
        Panel._panelCnt = 0;
        return Panel;
    })(BaseObject);
    Panels.Panel = Panel;
})(Panels || (Panels = {}));
/// <reference path="panel.ts" />
var Panels;
(function (Panels) {
    var PanelGroup = (function (_super) {
        __extends(PanelGroup, _super);
        /*get ContentElement(): JQuery {
        throw new MethodNotAccessibleException();
        }*/
        function PanelGroup() {
            _super.call(this);
            this.Panels = {};
            this.PanelElement.addClass('view-panel-group');
        }
        /**
        * Add an panel to the group.
        */
        PanelGroup.prototype.AddPanel = function (panel) {
            this.Panels[panel.PanelName] = panel;
            this.ContentElement.append(panel.PanelElement);
        };

        /**
        * Get a panel from the group by it's name.
        */
        PanelGroup.prototype.GetPanel = function (name) {
            if (this.Panels[name] === undefined)
                throw new UnknownPanelException();
            return this.Panels[name];
        };

        /**
        * Get a Panel of the specified type by the specified name.
        */
        PanelGroup.prototype.GetTypedPanel = function (name) {
            return this.GetPanel(name);
        };

        /**
        * Get all panels of the given type.
        */
        PanelGroup.prototype.GetPanelsByType = function (type) {
            var result = [];
            for (var pnl in this.Panels) {
                if (pnl instanceof type)
                    result[result.length] = pnl;
            }
            return result;
        };

        /**
        * Check if the group has a panel with the specified name.
        */
        PanelGroup.prototype.HasPanel = function (name) {
            return (this.Panels[name] !== undefined);
        };
        return PanelGroup;
    })(Panels.Panel);
    Panels.PanelGroup = PanelGroup;
})(Panels || (Panels = {}));

var UnknownPanelException = (function (_super) {
    __extends(UnknownPanelException, _super);
    function UnknownPanelException() {
        _super.apply(this, arguments);
        this.name = 'UnknownPanelException';
        this.message = 'The given panel is not registred with this group or by that name.';
    }
    return UnknownPanelException;
})(KeyNotFoundException);
/// <reference path="../Events/Events.ts" />
var Panels;
(function (Panels) {
    /**
    * @abstract
    */
    var ConsumablePanel = (function (_super) {
        __extends(ConsumablePanel, _super);
        function ConsumablePanel() {
            _super.apply(this, arguments);
            this.EventConsumers = new Collections.Dictionary();
            this.EventDelegates = new Collections.Dictionary();
            this.PropagationCanceled = false;
        }
        /**
        * Trigger an object event.
        */
        ConsumablePanel.prototype.Dispatch = function (eventName, event) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Attach an event consumer object
        */
        ConsumablePanel.prototype.Consume = function (consumer, events) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Remove an event consumer object
        */
        ConsumablePanel.prototype.Starve = function (consumer, events) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Register a single callback for a single event
        */
        ConsumablePanel.prototype.Attach = function (callback, events) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Remove an attached event
        */
        ConsumablePanel.prototype.Detach = function (callback, events) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Shorthand for Attach, use exectly like the jQuery exuivalent
        */
        ConsumablePanel.prototype.On = function (eventNames, callback) {
            throw new Error('Prototype copying failed.');
        };

        /**
        * Stop the current event cycle from bubbling further down the attached events.
        */
        ConsumablePanel.prototype.StopCurrentEventPropagation = function () {
            throw new Error('Prototype copying failed.');
        };
        return ConsumablePanel;
    })(Panels.Panel);
    Panels.ConsumablePanel = ConsumablePanel;

    Events.CopyEventDispatcherPrototype(ConsumablePanel);
})(Panels || (Panels = {}));
/// <reference path="ConsumablePanel.ts" />
var Panels;
(function (Panels) {
    var DynamicPanel = (function (_super) {
        __extends(DynamicPanel, _super);
        function DynamicPanel(RendererCallback) {
            _super.call(this);
            this.RendererCallback = RendererCallback;
        }
        DynamicPanel.prototype.Render = function () {
            this.RendererCallback(this.ContentElement, this.PanelElement, this);
        };
        return DynamicPanel;
    })(Panels.ConsumablePanel);
    Panels.DynamicPanel = DynamicPanel;
})(Panels || (Panels = {}));
/// <reference path="../LiftablePanel.ts" />
var Panels;
(function (Panels) {
    (function (Groups) {
        /**
        * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
        */
        var StackingPanelGroup = (function (_super) {
            __extends(StackingPanelGroup, _super);
            function StackingPanelGroup() {
                _super.apply(this, arguments);
            }
            StackingPanelGroup.prototype.Show = function (panelId) {
                _.each(this.Panels, function (val, key) {
                    if (key == panelId)
                        val.PanelElement.show();
                    else
                        val.PanelElement.hide();
                });
            };

            StackingPanelGroup.prototype.Hide = function (panelId) {
                _.each(this.Panels, function (val, key) {
                    if (key == panelId)
                        val.PanelElement.hide();
                });
            };

            StackingPanelGroup.prototype.Render = function () {
            };

            StackingPanelGroup.prototype.FillFromElement = function (panelElement, panels) {
                Panels.LiftablePanelHelper.ReplacePanelElements(this, panelElement);
                for (var i = 0; i < panels.length; i++) {
                    this.AddPanel(panels[i].Panel);
                }
            };
            return StackingPanelGroup;
        })(Panels.PanelGroup);
        Groups.StackingPanelGroup = StackingPanelGroup;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
/// <reference path="../../defs/jquery.d.ts" />
/// <reference path="Groups/StackingPanelGroup.ts" />
/// <reference path="panel.ts" />
/// <reference path="panelgroup.ts" />
var Panels;
(function (Panels) {
    /**
    * Simplest type of Panel that can be constructed from DOM.
    * Does absolutely nothing but serve as a facade to work with in the framework.
    */
    var LiftedPanel = (function (_super) {
        __extends(LiftedPanel, _super);
        function LiftedPanel(panelElement, contentElement) {
            _super.call(this);
            LiftablePanelHelper.ReplacePanelElements(this, panelElement, contentElement);
        }
        LiftedPanel.prototype.Renderer = function () {
        };

        LiftedPanel.prototype.FillFromElement = function (panelElement, contentElement) {
            LiftablePanelHelper.ReplacePanelElements(this, panelElement, contentElement);
        };
        return LiftedPanel;
    })(Panels.Panel);
    Panels.LiftedPanel = LiftedPanel;

    (function (LiftableElementState) {
        LiftableElementState[LiftableElementState["NotLiftable"] = 0] = "NotLiftable";
        LiftableElementState[LiftableElementState["Panel"] = 1] = "Panel";
        LiftableElementState[LiftableElementState["Group"] = 2] = "Group";
    })(Panels.LiftableElementState || (Panels.LiftableElementState = {}));
    var LiftableElementState = Panels.LiftableElementState;

    var LiftablePanelHelper = (function () {
        function LiftablePanelHelper() {
        }
        /**
        * Lifts a panel from an element. (Only a single panel is supported, the first found panel element is detached from the element, the rest is ignored.)
        */
        LiftablePanelHelper.LiftPanelFromElement = function (element) {
            // Check element itself
            var type = element.attr(this.DataPanelType);
            if (type == undefined) {
                var panelElement = element.detach();
                var contentElement = this.ExtractContentElement(panelElement);
                var conf = this.ExtractPanelConfig(panelElement);

                return {
                    Panel: this.LiftedPanelConstructor(panelElement, contentElement, type, conf.Value1),
                    GroupConfig: conf.Value2
                };
            } else {
                var panel = element.find('[' + this.DataPanelType + ']');
                if (panel.length == 0)
                    return undefined;
                else if (panel.length > 1) {
                    panel = panel.first();
                    console.log('Warning: Lifted a single panel from an element, where multiple elements where available.');
                }

                var panelElement = element.detach();
                var contentElement = this.ExtractContentElement(panelElement);
                var conf = this.ExtractPanelConfig(panelElement);

                return {
                    Panel: this.LiftedPanelConstructor(panelElement, contentElement, type, conf.Value1),
                    GroupConfig: conf.Value2
                };
            }
        };

        /**
        * Lifts a group from an element or a sub element. Only works on JQuery collections of length=1.
        */
        LiftablePanelHelper.LiftPanelGroupFromElement = function (element) {
            // Check element itself
            var type = element.attr(this.DataGroupType);
            if (type == undefined) {
                var panelElement = element.detach();
                var contentElement = this.ExtractContentElement(panelElement);
                var conf = this.ExtractPanelConfig(panelElement);

                var panels;
                if (contentElement != undefined)
                    panels = this.LiftAllWithPanelDataFromElement(contentElement);
                else
                    panels = this.LiftAllWithPanelDataFromElement(panelElement);

                return {
                    Panel: this.LiftedGroupConstructor(panelElement, contentElement, type, conf.Value1, panels),
                    GroupConfig: conf.Value2
                };
            } else {
                var panel = element.find('[' + this.DataGroupType + ']');
                if (panel.length == 0)
                    return undefined;
                else if (panel.length > 1) {
                    panel = panel.first();
                    console.log('Warning: Lifted a single panel from an element, where multiple elements where available.');
                }

                var panelElement = element.detach();
                var contentElement = this.ExtractContentElement(panelElement);
                var conf = this.ExtractPanelConfig(panelElement);

                var panels;
                if (contentElement != undefined)
                    panels = this.LiftAllWithPanelDataFromElement(contentElement);
                else
                    panels = this.LiftAllWithPanelDataFromElement(panelElement);

                return {
                    Panel: this.LiftedGroupConstructor(panelElement, contentElement, type, conf.Value1, panels),
                    GroupConfig: conf.Value2
                };
            }
        };

        /**
        * Lifts all panels from the given element. Also considers the element(s) themselves.
        * @returns A panel, panelgroup or a collection of either or both.
        */
        LiftablePanelHelper.LiftAllFromElement = function (elements) {
            var _this = this;
            var panels = [];
            elements.each(function (index, par) {
                jQuery(par).children().each(function (index, elem) {
                    var $elm = jQuery(elem);
                    var tp = _this.IsLiftableElement($elm);
                    switch (tp) {
                        case 1 /* Panel */:
                            panels.push(_this.LiftPanelFromElement($elm).Panel);
                            break;
                        case 2 /* Group */:
                            panels.push(_this.LiftPanelGroupFromElement($elm).Panel);
                            break;
                        case 0 /* NotLiftable */:
                            panels.concat(_this.LiftAllFromElement($elm));
                            break;
                    }
                });
            });
            return panels;
        };

        LiftablePanelHelper.LiftAllWithPanelDataFromElement = function (element) {
            var _this = this;
            var panels = [];
            element.each(function (index, elem) {
                var $elm = jQuery(elem);
                var tp = _this.IsLiftableElement($elm);
                switch (tp) {
                    case 1 /* Panel */:
                        panels.push(_this.LiftPanelFromElement($elm));
                        break;
                    case 2 /* Group */:
                        panels.push(_this.LiftPanelGroupFromElement($elm));
                        break;
                    case 0 /* NotLiftable */:
                        panels.concat(_this.LiftAllWithPanelDataFromElement($elm));
                        break;
                }
            });
            return panels;
        };

        /**
        * Check on a SINGLE element if it is liftable.
        */
        LiftablePanelHelper.IsLiftableElement = function (element) {
            if (element.attr(this.DataPanelType) != undefined)
                return 1 /* Panel */;
            if (element.attr(this.DataGroupType) != undefined)
                return 2 /* Group */;
            return 0 /* NotLiftable */;
        };

        LiftablePanelHelper.ExtractPanelConfig = function (panelElement) {
            var pconf = panelElement.attr(this.DataPanelConfig);
            var panelConfig;
            if (pconf != undefined && pconf.length > 0) {
                panelConfig = JSON.parse(pconf);
            } else
                panelConfig = [];

            var gconf = panelElement.attr(this.DataGroupConfig);
            var groupConfig;
            if (gconf != undefined && gconf.length > 0) {
                groupConfig = JSON.parse(gconf);
            } else
                groupConfig = [];

            return new Collections.Pair(panelConfig, groupConfig);
        };

        LiftablePanelHelper.ExtractContentElement = function (panelElement) {
            var contentElement = panelElement.find('[' + this.DataElementRole + '=content]');
            if (contentElement.length == 0)
                return undefined;
            else
                return contentElement.first();
        };

        /**
        * Lifts a panel from the element and returns it as the given type.
        */
        LiftablePanelHelper.LiftTypedPanelFromElement = function (element) {
            return this.LiftPanelFromElement(element);
        };

        LiftablePanelHelper.LiftedPanelConstructor = function (panelElement, contentElement, panelType, panelConfig) {
            if (panelType != undefined && panelType.length > 0) {
                // Defined type
                var constr = this.GetPanelObjectByString(panelType);
                if (constr == null) {
                    console.error('Undefined panel type set in element attribute. Given type "' + panelType + '" was not found and could not be instantiated.');

                    // try to fix it with the Default type
                    return this.DefaultPanelConstructor(panelElement, contentElement, panelConfig);
                } else {
                    return new (constr.bind.apply(constr, [constr].concat(panelConfig)))();
                }
            } else {
                // Default type
                return this.DefaultPanelConstructor(panelElement, contentElement, panelConfig);
            }
        };

        LiftablePanelHelper.LiftedGroupConstructor = function (panelElement, contentElement, groupType, panelConfig, panels) {
            if (typeof panels === "undefined") { panels = []; }
            if (groupType != undefined && groupType.length > 0) {
                // Defined type
                var constr = this.GetGroupObjectByString(groupType);
                if (constr == null) {
                    console.error('Undefined panel type set in element attribute. Given type "' + groupType + '" was not found and could not be instantiated.');

                    // try to fix it with the Default type
                    return this.DefaultPanelGroupConstructor(panelElement, contentElement, panelConfig, panels);
                } else {
                    var pn = new (constr.bind.apply(constr, [constr].concat(panelConfig)))();
                    pn.FillFromElement(panelElement, panels);
                    return pn;
                }
            } else {
                return this.DefaultPanelGroupConstructor(panelElement, contentElement, panelConfig, panels);
            }
        };

        /**
        * This method does a basic copy that will be able to replace the panel elements for most panels.
        * WARNING: This method makes assumptions, it will for example not copy any attributes other thatn the id and class attributes.
        */
        LiftablePanelHelper.ReplacePanelElements = function (panel, panelElement, contentElement) {
            var pn = panel;

            // panel element
            if (panelElement != undefined) {
                // copy panel name
                panelElement.attr('id', pn._panelElement.attr('id'));

                // copy any added classes
                var classes = pn._panelElement.attr('class').split(" ");
                for (var i = 0; i < classes.length; i++) {
                    panelElement.addClass(classes[i]);
                }

                pn._panelElement = panelElement;
            }

            // content element
            if (contentElement != undefined && panelElement != contentElement) {
                if (pn._panelElement == pn._contentElement) {
                    pn._contentElement = contentElement;
                } else {
                    // copy any added classes
                    var classes = pn._contentElement.attr('class').split(" ");
                    for (var i = 0; i < classes.length; i++) {
                        contentElement.addClass(classes[i]);
                    }

                    pn._contentElement = contentElement;
                }
            }
        };

        LiftablePanelHelper.IsLiftablePanel = function (obj) {
            return (obj != undefined && typeof obj['CreateFromElement'] == 'function');
        };

        LiftablePanelHelper.GetPanelObjectByString = function (objectPath) {
            var obj;
            if (objectPath.indexOf('.') > -1)
                obj = this.ResolveObjectForPath(objectPath);
            else
                obj = Panels[objectPath];
            if (this.IsLiftablePanel(obj))
                return obj;
            else
                return null;
        };

        LiftablePanelHelper.GetGroupObjectByString = function (objectPath) {
            var obj;
            if (objectPath.indexOf('.') > -1)
                obj = this.ResolveObjectForPath(objectPath);
            else
                obj = Panels.Groups[objectPath];
            if (this.IsLiftablePanel(obj))
                return obj;
            else
                return null;
        };

        LiftablePanelHelper.ResolveObjectForPath = function (objectPath) {
            try  {
                var spl = objectPath.split('.');
                var obj = window;
                for (var i = 0; i < spl.length; i++)
                    obj = obj[spl[i]];
                return obj;
            } catch (e) {
                return undefined;
            }
        };
        LiftablePanelHelper.DataElementRole = "data-element-role";

        LiftablePanelHelper.DataPanelType = "data-panel-type";

        LiftablePanelHelper.DataGroupType = "data-group-type";

        LiftablePanelHelper.DataPanelConfig = "data-panel-config";

        LiftablePanelHelper.DataGroupConfig = "data-group-config";

        LiftablePanelHelper.DefaultPanelConstructor = function (panelElement, contentElement, panelConfig) {
            return new LiftedPanel(panelElement, contentElement);
        };

        LiftablePanelHelper.DefaultPanelGroupConstructor = function (groupElement, contentElement, panels) {
            var group = new Panels.Groups.StackingPanelGroup();
            group.FillFromElement(groupElement, panels);
            return group;
        };
        return LiftablePanelHelper;
    })();
    Panels.LiftablePanelHelper = LiftablePanelHelper;
})(Panels || (Panels = {}));
var Panels;
(function (Panels) {
    /**
    * Panel that get's rendered from a Razor View and can have specific elements replaced/updated on specific events.
    * @abstract
    */
    var RazorPanel = (function (_super) {
        __extends(RazorPanel, _super);
        function RazorPanel(_partialUrl, _updateUrl) {
            _super.call(this);
            this._partialUrl = _partialUrl;
            this._updateUrl = _updateUrl;
            /**
            * Whether or not the main razor template was already loaded and rendered. (When this is true only partials are rerendered.)
            */
            this._rendered = false;
            /**
            * List of partial IDs that have been rendered right now.
            */
            this.RenderedPartials = [];
        }
        Object.defineProperty(RazorPanel.prototype, "IsRendered", {
            /**
            * Check whether or not the first/main renderer has already taken place.
            */
            get: function () {
                return this._rendered;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Determines what to render.
        */
        RazorPanel.prototype.Render = function () {
            if (!this._rendered) {
                this._rendered = true;
                this.MainRenderer();
            } else
                console.log('Render request on razor panel "' + this.PanelName + '"[' + this.PanelSeqId + '] has been ignored because the panel has already been rendered, only partial update events are accepted now.');
        };

        /**
        * Call this method to force the panel to refetch the main razor template. Use this if the partial updating went wrong, etc.
        */
        RazorPanel.prototype.ForceRerender = function () {
            this.MainRenderer();
        };

        /**
        * This method is called after the rendering of every partial piece of the panel. It can be used to add click events etc.
        * @abstract
        */
        RazorPanel.prototype.ProcessPartialRender = function (partialId, partialElement) {
            throw new AbstractMethodException();
        };

        /**
        * Renders the main razor panel.
        * @access protected
        */
        RazorPanel.prototype.MainRenderer = function () {
            var _this = this;
            this.FetchRazor(function (elem) {
                _this.ContentElement.empty();
                _this.ContentElement.append(elem);

                // loop over nested partials
                _this.ContentElement.find('div[data-partialid]').each(function (i, elem) {
                    var partialId = parseInt(elem.getAttribute('data-partialid'), 10);
                    _this.ProcessPartialRender(partialId, jQuery(elem));
                });
            });
        };

        /**
        * Rerenders/updates parts of the main rendered dom with partial templates.
        * @access protected
        */
        RazorPanel.prototype.PartialRenderer = function (partialId, html) {
            var _this = this;
            var replacedElement;
            if (_.contains(this.RenderedPartials, partialId))
                replacedElement = this.ContentElement.find('div[data-partialid=' + partialId + ']');
            else
                replacedElement = this.ContentElement.append('<div class="temp-partial">'); // just add a bogey elem at the end

            if (html === undefined) {
                this.FetchRazor(function (elem) {
                    replacedElement.replaceWith(elem);
                    _this.ProcessPartialRender(partialId, elem);
                }, partialId);
            } else {
                replacedElement.replaceWith(html);
                this.ProcessPartialRender(partialId, html);
            }
        };

        /**
        * Fetch the contents of a razor compiled template. Give an partialId
        */
        RazorPanel.prototype.FetchRazor = function (callback, partialId) {
            if (partialId === undefined)
                jQuery.get(this._partialUrl, null, function (data) {
                    callback(jQuery(data));
                }, 'html');
            else
                jQuery.get(this._partialUrl, { id: partialId }, function (data) {
                    callback(jQuery(data));
                }, 'html');
        };

        /**
        *
        */
        RazorPanel.prototype.ConsumeEvent = function (event) {
            var renderEvent = event;
            if (!(event instanceof RazorPartialUpdateEvent)) {
                var mapped = this.EventMapper(event);
                if (mapped != null)
                    renderEvent = mapped;
                else
                    return;
            }

            if (!_.contains(this.RenderedPartials, renderEvent.PartialId)) {
                if (renderEvent.PartialHtml !== undefined)
                    this.PartialRenderer(renderEvent.PartialId, renderEvent.PartialHtml);
                else
                    console.warn('Improperly filled RazorPartialUpdateEvent was fired;', renderEvent);
            } else {
                if (renderEvent.PartialHtml !== undefined)
                    this.PartialRenderer(renderEvent.PartialId, renderEvent.PartialHtml);
                else
                    this.PartialRenderer(renderEvent.PartialId);
            }
        };

        /**
        * This is the event mapper. It makes it possible for you to map an non razor event to an Razor event.
        * If this method returns null it will discard/ignore the event.
        * @abstract
        */
        RazorPanel.prototype.EventMapper = function (event) {
            return null;
        };
        return RazorPanel;
    })(Panels.Panel);
    Panels.RazorPanel = RazorPanel;

    var RazorPartialUpdateEvent = (function () {
        function RazorPartialUpdateEvent(_originatingObject, _eventName, _partialId, _partialHtml) {
            this._originatingObject = _originatingObject;
            this._eventName = _eventName;
            this._partialId = _partialId;
            this._partialHtml = _partialHtml;
        }
        Object.defineProperty(RazorPartialUpdateEvent.prototype, "EventName", {
            get: function () {
                return this._eventName;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RazorPartialUpdateEvent.prototype, "OriginatingObject", {
            get: function () {
                return this._originatingObject;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RazorPartialUpdateEvent.prototype, "PartialId", {
            /**
            * The Id number of an existing partial to update, or another positive number to add the element at the end or beginning.
            */
            get: function () {
                return this._partialId;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RazorPartialUpdateEvent.prototype, "PartialHtml", {
            /**
            * Optionally provide the HTML to fill the partial with, instead of asking the server for the content
            */
            get: function () {
                return this._partialHtml;
            },
            enumerable: true,
            configurable: true
        });

        RazorPartialUpdateEvent.prototype.StopPropagation = function () {
            this._originatingObject.StopCurrentEventPropagation();
        };
        return RazorPartialUpdateEvent;
    })();
    Panels.RazorPartialUpdateEvent = RazorPartialUpdateEvent;
})(Panels || (Panels = {}));
/// <reference path="ConsumablePanel.ts" />
var Panels;
(function (Panels) {
    /**
    * Panel that requires a "state" to be able to be rendered. WHen the state changes, it is automatically rerendered.
    * An example would be a model.
    */
    var StatefullPanel = (function (_super) {
        __extends(StatefullPanel, _super);
        function StatefullPanel(_renderOnStateChange) {
            _super.call(this);
            this._renderOnStateChange = _renderOnStateChange;
        }
        Object.defineProperty(StatefullPanel.prototype, "State", {
            get: function () {
                return this._state;
            },
            set: function (value) {
                this._state = value;
                if (this._renderOnStateChange)
                    this.Render();
            },
            enumerable: true,
            configurable: true
        });

        return StatefullPanel;
    })(Panels.ConsumablePanel);
    Panels.StatefullPanel = StatefullPanel;

    /**
    * Statefull panel that can have a ViewModel as state object.
    */
    var ModelPanel = (function (_super) {
        __extends(ModelPanel, _super);
        function ModelPanel(_renderOnStateChange, viewModel) {
            var _this = this;
            _super.call(this);
            this._renderOnStateChange = _renderOnStateChange;
            this._state = viewModel;
            this._state.On('change', function () {
                return _this.Render();
            });
        }
        Object.defineProperty(ModelPanel.prototype, "State", {
            get: function () {
                return this._state;
            },
            set: function (value) {
                var _this = this;
                this._state = value;
                if (this._renderOnStateChange) {
                    this.Render();
                    this._state.On('change', function () {
                        return _this.Render();
                    });
                }
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Render the current state object using the given template.
        */
        ModelPanel.prototype.RenderModel = function (templateName, async) {
            var _this = this;
            if (typeof async === "undefined") { async = true; }
            if (async)
                this.withTemplate(templateName, function (tpl) {
                    _this.ContentElement.html(tpl(_this.State.ToObject()));
                });
            else
                this.GetTemplate(templateName)(this.State.ToObject);
        };
        return ModelPanel;
    })(Panels.ConsumablePanel);
    Panels.ModelPanel = ModelPanel;
})(Panels || (Panels = {}));
var Panels;
(function (Panels) {
    /**
    * Panel that get's rendered only once, and only when needed based on a unfetched model. (That only get's fetched when the actal render method is called or the content element is retrieved or the model is fetched.)
    * @abstract
    */
    var StatelessPanel = (function (_super) {
        __extends(StatelessPanel, _super);
        function StatelessPanel(model) {
            _super.call(this);
            this._rendered = false;
            this._state = model;
            this._state.On('change', this.Render.bind(this));
        }
        Object.defineProperty(StatelessPanel.prototype, "State", {
            /**
            * Get the current state of the object.
            */
            get: function () {
                return this._state;
            },
            /**
            * @access private
            */
            set: function (value) {
                throw new MethodNotAccessibleException();
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(StatelessPanel.prototype, "IsRendered", {
            /**
            * Check whether this class has already been rendered.
            */
            get: function () {
                return this._rendered;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StatelessPanel.prototype, "ContentElement", {
            /**
            * Get the innermost element of the panel.
            */
            get: function () {
                if (this._rendered === false)
                    this.Render();
                return this.Cast()._contentElement;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Calls the deferred renderer only once.
        */
        StatelessPanel.prototype.Render = function () {
            if (!this.IsRendered) {
                this._rendered = true;
                this.StateRenderer();
            } else
                console.log('State change or render request on stateless panel "' + this.PanelName + '"[' + this.PanelSeqId + '] has been ignored because the panel has already been rendered.');
        };

        /**
        * This is the deferred renderer function.
        * Implement it to use this abstract class.
        * @abstract
        */
        StatelessPanel.prototype.StateRenderer = function () {
            throw new AbstractMethodException();
        };
        return StatelessPanel;
    })(Panels.Panel);
    Panels.StatelessPanel = StatelessPanel;
})(Panels || (Panels = {}));
/// <reference path="../../EqualityComparer.ts" />
var Panels;
(function (Panels) {
    /**
    * This is used as a type to establish the identity of an individual panel within the system, so that the system always knows what panel everyone is talking aout.
    * Can also be read as PanelReference
    */
    var PanelReference = (function (_super) {
        __extends(PanelReference, _super);
        function PanelReference(_panel, _group) {
            _super.call(this);
            this._panel = _panel;
            this._group = _group;
            // @todo use event system to listen to panel destruction.
        }
        Object.defineProperty(PanelReference.prototype, "PanelName", {
            /**
            * Get the css id
            */
            get: function () {
                return this._panel.PanelName;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PanelReference.prototype, "QueryString", {
            /**
            * Get an unique query string that will point you to the PANEL element
            */
            get: function () {
                return '#' + this.PanelName;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PanelReference.prototype, "OuterElement", {
            /**
            * Get the panel element wrapped in an jQuery object
            */
            get: function () {
                return this._panel.PanelElement;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PanelReference.prototype, "InnerElement", {
            /**
            * Get the innermost element (Will be same element as the outermost element for most elements, will be different for crollable panels etc.)
            */
            get: function () {
                return this._panel.ContentElement;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PanelReference.prototype, "Visibility", {
            /**
            * Get whether or not the panel is currently shown in the viewport.
            */
            get: function () {
                return this._group.IsVisible(this.PanelName);
            },
            /**
            * Set the visibility of the element inside the viewport.
            */
            set: function (show) {
                if (show)
                    this._group.Show(this.PanelName);
                else
                    this._group.Hide(this.PanelName);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PanelReference.prototype, "Group", {
            /**
            * Get the group this panel is in.
            */
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PanelReference.prototype, "Panel", {
            /**
            * Get the panel this object references to.
            */
            get: function () {
                return this._panel;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Replacement for the toString builtin.
        */
        PanelReference.prototype.toString = function () {
            return this.PanelName;
        };

        // #section IEqualityComparable Implementation
        /**
        * Checks whether two references are refering to the same object.
        */
        PanelReference.prototype.Equals = function (obj) {
            if (obj === undefined)
                throw new NullReferenceException();
            return obj.PanelName == this.PanelName;
        };

        /**
        * Get an unique hashcode for the referenced panel.
        */
        PanelReference.prototype.GetHashCode = function () {
            return this._panel.PanelSeqId;
        };
        return PanelReference;
    })(BaseObject);
    Panels.PanelReference = PanelReference;
})(Panels || (Panels = {}));
/// <reference path="Utils/PanelReference.ts" />
/// <reference path="../Collections/Tuple.ts" />
/// <reference path="../Collections/List.ts" />
/// <reference path="../../defs/jquery.d.ts" />
var Panels;
(function (Panels) {
    (function (Viewport) {
        /**
        * Defines the side towards which a Direction is aimed.
        */
        (function (Side) {
            Side[Side["Left"] = 0] = "Left";
            Side[Side["Right"] = 1] = "Right";
            Side[Side["Top"] = 2] = "Top";
            Side[Side["Down"] = 3] = "Down";
        })(Viewport.Side || (Viewport.Side = {}));
        var Side = Viewport.Side;

        /**
        * Defines what direction a movement is going.
        */
        (function (Direction) {
            Direction[Direction["Forward"] = 0] = "Forward";
            Direction[Direction["Backward"] = 1] = "Backward";
            Direction[Direction["Sidewards"] = 2] = "Sidewards";
        })(Viewport.Direction || (Viewport.Direction = {}));
        var Direction = Viewport.Direction;

        
    })(Panels.Viewport || (Panels.Viewport = {}));
    var Viewport = Panels.Viewport;
})(Panels || (Panels = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Panel.ts" />
/// <reference path="PanelGroup.ts" />
/// <reference path="ConsumablePanel.ts" />
/// <reference path="DynamicPanel.ts" />
/// <reference path="LiftablePanel.ts" />
/// <reference path="RazorPanel.ts" />
/// <reference path="StatefullPanel.ts" />
/// <reference path="StatelessPanel.ts" />
/// <reference path="ViewportManager.ts" />
var Panels;
(function (Panels) {
    (function (Utils) {
        /**
        * INTERNAL CLASS
        * Used for easily managing references and reordering them in place.
        * @access protected
        */
        var ReferenceManager = (function (_super) {
            __extends(ReferenceManager, _super);
            function ReferenceManager(maximalVisibleCount) {
                if (typeof maximalVisibleCount === "undefined") { maximalVisibleCount = 0; }
                _super.call(this);
                this.maximalVisibleCount = maximalVisibleCount;
                this.References = new Collections.List();
            }
            ReferenceManager.prototype.EachRef = function (callback) {
                this.References.Each(function (x) {
                    return callback(x.Reference, x.Visible);
                });
            };

            ReferenceManager.prototype.AttachRef = function (ref) {
                this.References.Add({
                    Reference: ref,
                    Visible: false
                });
            };

            ReferenceManager.prototype.DetachRef = function (ref) {
                this.References.RemoveAll(function (x) {
                    return x.Reference.Equals(ref);
                });
            };

            ReferenceManager.prototype.HasRef = function (ref) {
                return this.References.Any(function (x) {
                    return x.Reference.Equals(ref);
                });
            };

            ReferenceManager.prototype.HasRefByName = function (name) {
                return this.References.Any(function (x) {
                    return x.Reference.PanelName == name;
                });
            };

            ReferenceManager.prototype.GetRefByName = function (name) {
                try  {
                    return this.References.First(function (x) {
                        return x.Reference.PanelName == name;
                    }).Reference;
                } catch (e) {
                    console.warn(e);
                    throw new KeyNotFoundException('Panel reference not found.');
                }
            };

            ReferenceManager.prototype.GetRefsByPanelType = function (type) {
                return this.References.Select(function (x) {
                    return x.Reference.Panel;
                }).Where(function (x) {
                    return x instanceof type;
                }).ToArray();
            };

            ReferenceManager.prototype.PositionOfRef = function (ref) {
                return this.References.IndexOfFirst(function (x) {
                    return x.Reference.Equals(ref);
                });
            };

            /**
            * Move the given element one place back in the list.
            */
            ReferenceManager.prototype.MoveBack = function (ref) {
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(i - 1, elem);
            };

            /**
            * Move the given element one place forward in the list.
            */
            ReferenceManager.prototype.MoveForward = function (ref) {
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(i + 1, elem);
            };

            /**
            * Move the given ref to the given index.
            */
            ReferenceManager.prototype.MoveTo = function (ref, index) {
                if (index > this.References.Count)
                    throw new Error('ReferenceManager; Index out of bounds.');
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(index, elem);
            };

            /**
            * Get all panels that are visible in the viewport.
            */
            ReferenceManager.prototype.GetVisible = function () {
                return this.References.Where(function (x) {
                    return x.Visible === true;
                }).Select(function (x) {
                    return x.Reference;
                });
            };

            /**
            * Check if a panel is visible or not.
            */
            ReferenceManager.prototype.IsVisible = function (ref) {
                return;
                this.References.FirstOrDefault({ Reference: null, Visible: null }, function (x) {
                    return x.Reference.Equals(ref);
                }).Visible;
            };

            ReferenceManager.prototype.SetVisibility = function (ref, visibility) {
                try  {
                    this.References.First(function (x) {
                        return x.Reference.Equals(ref);
                    }).Visible = visibility;
                } catch (e) {
                    console.warn(e); // just for debugging.
                }
            };

            ReferenceManager.prototype.SetVisibilityAll = function (visibility) {
                this.References.Each(function (x) {
                    return x.Visible = visibility;
                });
            };

            ReferenceManager.prototype.GetCurrentState = function () {
                var cnt = 0;
                return this.References.Select(function (x) {
                    return {
                        Visibility: x.Visible,
                        Reference: x.Reference,
                        Position: (x.Visible ? cnt++ : null)
                    };
                });
            };

            /**
            * Iterate over all panels in the dictionary returning an array with the corrected order and how each reference was mutated.
            * @return <Panel, Direction of animation, Places Moved, oldVisibility>
            */
            ReferenceManager.prototype.TrackChanges = function (callback, animationDirectionCallback) {
                // Make a snapshot of the current situation
                var before = this.GetCurrentState();

                // Do the requested stuff
                callback();

                // Make sure there were no references attached or detached.
                if (before.CountAll() != this.References.Count)
                    throw new RuntimeException('Sorry I cannot track changes when refs are detached or atached.');

                // Calculate the differences and return
                var pos = 0;
                return this.References.Select(function (changedItem) {
                    var previousState = before.First(function (x) {
                        return x.Reference.Equals(changedItem.Reference);
                    });
                    var newPosition = changedItem.Visible ? pos++ : null;
                    var stateChange = {
                        Reference: changedItem.Reference,
                        Visibility: changedItem.Visible,
                        Position: newPosition,
                        Changed: (previousState.Position != newPosition || previousState.Visibility != changedItem.Visible),
                        PreviousPosition: previousState.Position,
                        PreviousVisibility: previousState.Visibility,
                        Moves: previousState.Position - newPosition,
                        MovementDirection: ((newPosition > previousState.Position) ? 0 /* Forward */ : 1 /* Backward */),
                        AnimationDirection: null
                    };

                    if (animationDirectionCallback != null)
                        animationDirectionCallback(stateChange);

                    return stateChange;
                });
            };
            return ReferenceManager;
        })(BaseObject);
        Utils.ReferenceManager = ReferenceManager;
    })(Panels.Utils || (Panels.Utils = {}));
    var Utils = Panels.Utils;
})(Panels || (Panels = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="PanelReference.ts" />
/// <reference path="ReferenceManager.ts" />
var Panels;
(function (Panels) {
    (function (Viewport) {
        /**
        * Defines the orientation of an axisbound operation.
        */
        (function (Orientation) {
            Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
            Orientation[Orientation["Vertical"] = 1] = "Vertical";
        })(Viewport.Orientation || (Viewport.Orientation = {}));
        var Orientation = Viewport.Orientation;

        /**
        * Viewport Manager that tiles the panels horizontally OR vertically.
        * Has animations.
        */
        var TilingViewportManager = (function () {
            /**
            * Viewport recieves PanelGroup element that represents the viewport.
            */
            function TilingViewportManager(ViewportOrientation, AnimateInitialState) {
                if (typeof ViewportOrientation === "undefined") { ViewportOrientation = 0 /* Horizontal */; }
                if (typeof AnimateInitialState === "undefined") { AnimateInitialState = false; }
                this.ViewportOrientation = ViewportOrientation;
                this.AnimateInitialState = AnimateInitialState;
                this.AnimationDuration = 300;
                this.AnimationEasing = 'linear';
            }
            /**
            * Viewport recieves PanelGroup element that represents the viewport.
            */
            TilingViewportManager.prototype.SetElement = function (viewportElement) {
                var cssClass = this.ViewportOrientation == 0 /* Horizontal */ ? TilingViewportManager.ViewportClassHorizontal : TilingViewportManager.ViewportClassVertical;
                if (this.Element != null)
                    this.Element.removeClass(cssClass);
                this.Element = viewportElement;
                this.Element.addClass(cssClass);
            };

            /**
            * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
            */
            TilingViewportManager.prototype.Attach = function (ref) {
                this.Element.append(ref.OuterElement.hide());
            };

            /**
            * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
            */
            TilingViewportManager.prototype.Detach = function (ref) {
                ref.OuterElement.show().detach();
            };

            /**
            * Check whether this Viewportmanager manages/knows this panel.
            */
            TilingViewportManager.prototype.IsAttached = function (ref) {
                return ref.OuterElement.parent().attr('id') == this.Element.attr('id');
            };

            /**
            * Arrange the given panels in the viewport according to the given orientation.
            */
            TilingViewportManager.prototype.Arrange = function (arrangement) {
                var _this = this;
                // Check the number of visible panels.
                var visibleBefore = arrangement.CountAll(function (x) {
                    return x.PreviousVisibility == true;
                });
                var visibleAfter = arrangement.CountAll(function (x) {
                    return x.Visibility == true;
                });

                var firstVisible = arrangement.First(function (x) {
                    return x.Visibility == true;
                });
                var lastVisible = arrangement.Last(function (x) {
                    return x.Visibility == true;
                });

                // Apply the correct offsets and widths to all panels.
                arrangement.Each(function (ref) {
                    // Calculate prev position
                    var prevWidth = 100 / visibleBefore;
                    var prevOffset = prevWidth * ref.PreviousPosition;

                    // Calculate new position
                    var width = 100 / visibleAfter;
                    var offset = width * ref.Position;

                    if (ref.Changed || visibleBefore != visibleAfter) {
                        if (ref.PreviousVisibility != ref.Visibility) {
                            if (ref.Visibility == true) {
                                ref.Reference.OuterElement.css({
                                    left: offset + '%',
                                    top: '-100%',
                                    width: width + '%'
                                }).show();
                                ref.Reference.OuterElement.animate({
                                    top: '0%'
                                }, {
                                    duration: _this.AnimationDuration,
                                    easing: _this.AnimationEasing
                                });
                            } else {
                                ref.Reference.OuterElement.animate({
                                    top: '100%'
                                }, {
                                    complete: function () {
                                        ref.Reference.OuterElement.hide();
                                    },
                                    duration: _this.AnimationDuration,
                                    easing: _this.AnimationEasing
                                });
                            }
                        } else {
                            if (ref.Visibility == true) {
                                // Animate
                                ref.Reference.OuterElement.css({
                                    left: prevOffset + '%',
                                    width: prevWidth + '%'
                                }).animate({
                                    left: offset + '%',
                                    width: width + '%'
                                }, {
                                    duration: _this.AnimationDuration,
                                    easing: _this.AnimationEasing
                                });
                            } else {
                                // edge case
                                ref.Reference.OuterElement.hide();
                            }
                        }
                    }
                });
            };

            /**
            * Arrange the panels in the viewport for the first render of the panelgroup.
            */
            TilingViewportManager.prototype.ArrangeInitial = function (arrangement) {
                var _this = this;
                // Check the number of visible panels.
                var visible = arrangement.CountAll(function (x) {
                    return x.Visibility == true;
                });

                // Apply the correct offsets and widths to all panels.
                arrangement.Each(function (ref) {
                    // Calculate initial position
                    var width = 100 / visible;
                    var offset = width * ref.Position;

                    if (_this.AnimateInitialState && ref.Visibility == true) {
                        ref.Reference.OuterElement.css({
                            left: offset + '%',
                            top: '-100%',
                            width: width + '%'
                        }).show();
                        ref.Reference.OuterElement.animate({
                            top: '0%'
                        }, {
                            duration: _this.AnimationDuration,
                            easing: _this.AnimationEasing
                        });
                    } else if (ref.Visibility == true) {
                        // Animate
                        ref.Reference.OuterElement.css({
                            left: offset + '%',
                            width: width + '%'
                        }).show();
                    } else {
                        // edge case
                        ref.Reference.OuterElement.hide();
                    }
                });
            };

            /**
            * This viewport manager does not rely on this functionality.
            * @return null
            */
            TilingViewportManager.prototype.GetAnimationDirectionProvider = function () {
                return null;
            };
            TilingViewportManager.ViewportClassHorizontal = 'tiling-viewport-horizontal';
            TilingViewportManager.ViewportClassVertical = 'tiling-viewport-vertical';
            return TilingViewportManager;
        })();
        Viewport.TilingViewportManager = TilingViewportManager;
    })(Panels.Viewport || (Panels.Viewport = {}));
    var Viewport = Panels.Viewport;
})(Panels || (Panels = {}));
/// <reference path="../../../defs/jquery.d.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="TilingViewportManager.ts" />
/// <reference path="ComposedViewportManager.ts" />
var Panels;
(function (Panels) {
    (function (Groups) {
        /**
        * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
        */
        var TabbedPanelGroup = (function (_super) {
            __extends(TabbedPanelGroup, _super);
            function TabbedPanelGroup() {
                _super.call(this);
                this.TabsListElement = jQuery("<ul>");
                this.PanelElement.prepend(this.TabsListElement);
            }
            /**
            * Add an panel to the group.
            */
            TabbedPanelGroup.prototype.AddPanel = function (panel) {
                this.AddTab(panel, panel.PanelName);
            };

            TabbedPanelGroup.prototype.AddTab = function (panel, label) {
                var _this = this;
                _super.prototype.AddPanel.call(this, panel);
                this.TabsListElement.append(jQuery("<li data-panelid=\"" + panel.PanelSeqId + "\">" + panel.PanelName + "</li>").click(function (e) {
                    return _this.Show(panel.PanelName);
                }));
            };

            TabbedPanelGroup.prototype.SetLabel = function (panelName, label) {
                this.FindTabByName(panelName).text(label);
            };

            TabbedPanelGroup.prototype.Show = function (name) {
                _super.prototype.Show.call(this, name);
                this.TabsListElement.find("li.active").removeClass("active");
                this.FindTabByName(name).addClass("active");
            };

            TabbedPanelGroup.prototype.FindTabByName = function (name) {
                return this.TabsListElement.find("li[data-panelid=" + this.Panels[name].PanelSeqId + "]");
            };

            /**
            *
            */
            TabbedPanelGroup.prototype.Render = function () {
                // render tabs
            };
            return TabbedPanelGroup;
        })(Panels.Groups.StackingPanelGroup);
        Groups.TabbedPanelGroup = TabbedPanelGroup;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
/// <reference path="../ViewportManager.ts" />
/// <reference path="../PanelGroup.ts" />
/// <reference path="../Utils/ReferenceManager.ts" />
var Panels;
(function (Panels) {
    (function (Groups) {
        /**
        * @abstract
        */
        var ManagedPanelGroup = (function (_super) {
            __extends(ManagedPanelGroup, _super);
            function ManagedPanelGroup(viewport, _defaultVisibility, maximalVisibleCount) {
                if (typeof _defaultVisibility === "undefined") { _defaultVisibility = true; }
                if (typeof maximalVisibleCount === "undefined") { maximalVisibleCount = 0; }
                var _this = this;
                _super.call(this);
                this._defaultVisibility = _defaultVisibility;
                this._rendered = false;
                this._viewport = viewport;
                this._viewport.SetElement(this.ContentElement);
                this.Panels = null;
                this.References = new Panels.Utils.ReferenceManager(maximalVisibleCount);
                this.InitEventSystem();

                // Helps you realise that you forgot to render.
                setTimeout(function () {
                    if (_this._rendered == false)
                        console.warn('Did you forget to render the panelgroup "' + _this.PanelName + '"? It has been 6 seconds since you created it...');
                }, 6000);
            }
            Object.defineProperty(ManagedPanelGroup.prototype, "Viewport", {
                get: function () {
                    return this._viewport;
                },
                set: function (viewport) {
                    throw new Error('By default it\'s not possible to change the viewport manager after the object has been created.');
                },
                enumerable: true,
                configurable: true
            });

            ManagedPanelGroup.prototype.Render = function () {
                if (this._rendered == false) {
                    // First render
                    this._rendered = true;

                    // show all if default visible
                    if (this._defaultVisibility == true) {
                        this._viewport.ArrangeInitial(this.References.GetCurrentState());
                    }
                }
                this.References.GetVisible().Each(function (x) {
                    return x.Panel.Render();
                });
            };

            /**
            * Add an panel to the group.
            */
            ManagedPanelGroup.prototype.AddPanel = function (panel) {
                var ref = this.MakeReference(panel);
                this.References.AttachRef(ref);
                this._viewport.Attach(ref);
                if (this._defaultVisibility)
                    this.ShowByReference(ref);
            };

            /**
            * Get a panel from the group by it's name.
            */
            ManagedPanelGroup.prototype.GetPanel = function (name) {
                return this.References.GetRefByName(name).Panel;
            };

            /**
            * Get a Panel of the specified type by the specified name.
            */
            ManagedPanelGroup.prototype.GetTypedPanel = function (name) {
                return this.References.GetRefByName(name).Panel;
            };

            /**
            * Get all panels of the given type.
            */
            ManagedPanelGroup.prototype.GetPanelsByType = function (type) {
                return this.References.GetRefsByPanelType(type);
            };

            /**
            * Check if the group has a panel with the specified name.
            */
            ManagedPanelGroup.prototype.HasPanel = function (name) {
                if (name === undefined || name == '')
                    return false;
                return this.References.HasRefByName(name);
            };

            /**
            * Check if this PanelGroup contains the given panel.
            */
            ManagedPanelGroup.prototype.HasPanelByReference = function (ref) {
                if (ref === undefined || ref === null)
                    return false;
                return this.References.HasRef(ref);
            };

            /**
            * Show a panel in view.
            */
            ManagedPanelGroup.prototype.Show = function (name) {
                if (this.References.HasRefByName(name))
                    this.ShowByReference(this.NameToReference(name));
                else
                    throw new UnknownPanelException();
            };

            /**
            * Show a panel by its reference object.
            */
            ManagedPanelGroup.prototype.ShowByReference = function (ref) {
                var _this = this;
                if (this.HasPanelByReference(ref)) {
                    if (this._rendered) {
                        this._viewport.Arrange(this.References.TrackChanges(function () {
                            _this.References.SetVisibility(ref, true);
                        }, this._viewport.GetAnimationDirectionProvider()));
                    } else {
                        this.References.SetVisibility(ref, true);
                    }

                    // Dispatch event AFTER the view change.
                    this.Dispatch('show', new PanelGroupVisibilityEvent(this, 'show', ref));
                } else
                    throw new UnknownPanelException();
            };

            /**
            * Hide a Panel from view.
            */
            ManagedPanelGroup.prototype.Hide = function (name) {
                if (this.References.HasRefByName(name))
                    this.HideByReference(this.NameToReference(name));
                else
                    throw new UnknownPanelException();
            };

            /**
            * Hide a panel by its reference object.
            */
            ManagedPanelGroup.prototype.HideByReference = function (ref) {
                var _this = this;
                if (this.HasPanelByReference(ref)) {
                    if (this._rendered) {
                        this._viewport.Arrange(this.References.TrackChanges(function () {
                            _this.References.SetVisibility(ref, false);
                        }, this._viewport.GetAnimationDirectionProvider()));
                    } else {
                        this.References.SetVisibility(ref, false);
                    }

                    // Dispatch event AFTER the view change.
                    this.Dispatch('hide', new PanelGroupVisibilityEvent(this, 'hide', ref));
                } else
                    throw new UnknownPanelException();
            };

            /**
            * Check if a panel is shown in the current viewport.
            */
            ManagedPanelGroup.prototype.IsVisible = function (name) {
                return this.IsVisibleByReference(this.NameToReference(name));
            };

            /**
            * Check if a panel is visible by checking it's reference.
            */
            ManagedPanelGroup.prototype.IsVisibleByReference = function (ref) {
                return this.References.IsVisible(ref);
            };

            /**
            * Place multiple panels in the viewport in the given order, hiding any other attached panels.
            */
            ManagedPanelGroup.prototype.Place = function (names) {
                var places = [];
                for (var i = 0; i < names.length; i++) {
                    if (this.HasPanel(names[i]))
                        places.push(this.NameToReference(names[i]));
                    else
                        throw new UnknownPanelException();
                }
                this.PlaceByReferences(places);
            };

            /**
            * Place multiple panels in the viewport in the given order, hiding any other attached panels.
            */
            ManagedPanelGroup.prototype.PlaceByReferences = function (refs) {
                var _this = this;
                // Track the changes the refs imply.
                var changes = this.References.TrackChanges(function () {
                    _this.References.SetVisibilityAll(false);
                    for (var i = 0; i < refs.length; i++) {
                        if (_this.References.HasRef(refs[i]))
                            _this.References.SetVisibility(refs[i], true);
                        else
                            throw new KeyNotFoundException();
                    }
                }, this._viewport.GetAnimationDirectionProvider());

                // Only apply the animations when the panel is already rendered.
                if (this._rendered) {
                    this._viewport.Arrange(changes);
                }

                // Dispatch event AFTER the view change.
                changes.Each(function (x) {
                    if (x.PreviousVisibility != x.Visibility) {
                        if (x.Visibility == true)
                            _this.Dispatch('show', new PanelGroupVisibilityEvent(_this, 'show', x.Reference));
                        else
                            _this.Dispatch('hide', new PanelGroupVisibilityEvent(_this, 'hide', x.Reference));
                    }
                });
            };

            /**
            * Convert an Panel associated with this group to an reference.
            */
            ManagedPanelGroup.prototype.NameToReference = function (name) {
                return this.References.GetRefByName(name);
            };

            ManagedPanelGroup.prototype.MakeReference = function (panel) {
                return new Panels.PanelReference(panel, this);
            };

            //#section IEventDispatcher Impl.
            /**
            * Trigger an object event.
            */
            ManagedPanelGroup.prototype.Dispatch = function (eventName, event) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Attach an event consumer object
            */
            ManagedPanelGroup.prototype.Consume = function (consumer, events) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Remove an event consumer object
            */
            ManagedPanelGroup.prototype.Starve = function (consumer, events) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Register a single callback for a single event
            */
            ManagedPanelGroup.prototype.Attach = function (callback, events) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Remove an attached event
            */
            ManagedPanelGroup.prototype.Detach = function (callback, events) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Shorthand for Attach, use exectly like the jQuery exuivalent
            */
            ManagedPanelGroup.prototype.On = function (eventNames, callback) {
                throw new MethodNotOverwrittenException();
            };

            /**
            * Stop the current event cycle from bubbling further down the attached events.
            */
            ManagedPanelGroup.prototype.StopCurrentEventPropagation = function () {
                throw new MethodNotOverwrittenException();
            };
            return ManagedPanelGroup;
        })(Panels.PanelGroup);
        Groups.ManagedPanelGroup = ManagedPanelGroup;
        Events.CopyEventDispatcherPrototype(ManagedPanelGroup);

        var PanelGroupVisibilityEvent = (function () {
            function PanelGroupVisibilityEvent(_originatingObject, _eventName, _panelReference) {
                this._originatingObject = _originatingObject;
                this._eventName = _eventName;
                this._panelReference = _panelReference;
            }
            Object.defineProperty(PanelGroupVisibilityEvent.prototype, "EventName", {
                get: function () {
                    return this._eventName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelGroupVisibilityEvent.prototype, "OriginatingObject", {
                get: function () {
                    return this._originatingObject;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelGroupVisibilityEvent.prototype, "PanelName", {
                get: function () {
                    return this._panelReference.PanelName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelGroupVisibilityEvent.prototype, "PanelReference", {
                get: function () {
                    return this._panelReference;
                },
                enumerable: true,
                configurable: true
            });

            PanelGroupVisibilityEvent.prototype.StopPropagation = function () {
                this._originatingObject.StopCurrentEventPropagation();
            };
            return PanelGroupVisibilityEvent;
        })();
        Groups.PanelGroupVisibilityEvent = PanelGroupVisibilityEvent;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
/// <reference path="ManagedPanelGroup.ts" />
var Panels;
(function (Panels) {
    (function (Groups) {
        var ResponsivePanelGroup = (function (_super) {
            __extends(ResponsivePanelGroup, _super);
            function ResponsivePanelGroup() {
                _super.apply(this, arguments);
            }
            /**
            * Create a ResponsivePanelGroup and auto create a viewportmanager for it of your choice with the given arguments.
            */
            ResponsivePanelGroup.CreateWithViewport = function (viewportType) {
                var viewportArgs = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    viewportArgs[_i] = arguments[_i + 1];
                }
                return new ResponsivePanelGroup(new (Function.prototype.bind.apply(viewportType, arguments)));
            };
            return ResponsivePanelGroup;
        })(Panels.Groups.ManagedPanelGroup);
        Groups.ResponsivePanelGroup = ResponsivePanelGroup;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
var Panels;
(function (Panels) {
    (function (Groups) {
        /**
        * Panel group that supports compositing
        */
        var ComposablePanelGroup = (function (_super) {
            __extends(ComposablePanelGroup, _super);
            function ComposablePanelGroup() {
                _super.apply(this, arguments);
            }
            ComposablePanelGroup.prototype.Compose = function (composition) {
            };
            return ComposablePanelGroup;
        })(Panels.Groups.ManagedPanelGroup);
        Groups.ComposablePanelGroup = ComposablePanelGroup;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="StackingPanelGroup.ts" />
/// <reference path="TabbedPanelGroup.ts" />
/// <reference path="ManagedPanelGroup.ts" />
/// <reference path="ResponsivePanelGroup.ts" />
/// <reference path="ComposablePanelGroup.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Utils/_include.ts" />
/// <reference path="Viewport/_include.ts" />
/// <reference path="Groups/_include.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="_baseinclude.ts" />
/// <reference path="_packages.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="Collections/_include.ts" />
/// <reference path="Events/_include.ts" />
/// <reference path="Model/_include.ts" />
/// <reference path="Notifications/_include.ts" />
/// <reference path="Panels/_include.ts" />
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
/// <reference path="_baseinclude.ts" />
/// <reference path="_packages.ts" />
// This ensures that the typescript compiler compiles all files in the correct order
/// <reference path="defs/_include.ts" />
/// <reference path="framework/_include.ts" />
