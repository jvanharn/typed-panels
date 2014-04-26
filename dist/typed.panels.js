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
            elements.each(function (index, elem) {
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
        })(Groups.StackingPanelGroup);
        Groups.TabbedPanelGroup = TabbedPanelGroup;
    })(Panels.Groups || (Panels.Groups = {}));
    var Groups = Panels.Groups;
})(Panels || (Panels = {}));
// This is a reference file, this just mitigates the problem that the typescript on-file compiler is horribly broken and compiles these files in the wrong order.
// This file only includes the panels in this package that can be used without requiring many of the other packages.
/// <reference path="Panel.ts" />
/// <reference path="PanelGroup.ts" />
/// <reference path="LiftablePanel.ts" />
/// <reference path="ViewportManager.ts" />
/// <reference path="Groups/StackingPanelGroup.ts" />
/// <reference path="Groups/TabbedPanelGroup.ts" />
// This ensures that the typescript compiler compiles all files in the correct order
/// <reference path="defs/_include.ts" />
/// <reference path="framework/_baseinclude.ts" />
/// <reference path="framework/Collections/_include.ts" />
/// <reference path="framework/Panels/_atomicinclude.ts" />
