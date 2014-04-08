function namespace(ns) {
	var nsArr = ns.split(".");
	var nsParentObj = parent;
	var nsId = "";
	for (var i = 0; i < nsArr.length; i++) {
		nsId = nsId === "" ? nsArr[i] : nsId + "." + nsArr[i];
		if (!nsParentObj[nsArr[i]]) {
			nsParentObj[nsArr[i]] = {};
			nsParentObj[nsArr[i]].nsId = nsId;
			nsParentObj[nsArr[i]].toString = function () {
				return "NAMESPACE: " + this.nsId;
			};
		}
		nsParentObj = nsParentObj[nsArr[i]];
	}
	this[nsArr[0]] = parent[nsArr[0]]; // Make NS reachable from current context
}

namespace("js.repository");

String.isBlank = function (str) {
	if (!str) {
		return true;
	}
	if (str.constructor !== String) {
		var details = "Not a String";
		throw details;
	}
	if (str === '') {
		return true;
	}
	return false;
};

String.isNotBlank = function (str) {
	return !String.isBlank(str);
};

String.isEmpty = function (str) {
	return String.isBlank(str) ? true : str.trim() === '';
};

String.isNotEmpty = function (str) {
	return !String.isEmpty(str);
};

if (!String.prototype.trim) {
	String.prototype.trim = function () {		
    var str = this.valueOf();
    var pos = -1;
    var space = " ";
    if ((pos = str.indexOf(space)) == 0){		
    	while(str.charAt(pos) == space) {
    			pos++;
    	}		
		str = str.substring(pos);		
    }
    if ((pos = str.indexOf(space, str.length - 1)) != -1) {
    	while(str.charAt(pos) != space) {
    			pos--;
    	}		
    	str = str.substring(0, pos);			
		}
    	return str;
	};
}

String.pad = function (str, totalChars, padWith, right) {
	str = str + "";
	padWith = (padWith) ? padWith + "" : "0";
	var padded = false;
	if (str.length < totalChars) {
		while (str.length < totalChars) {
			padded = true;
			if (right) {
				str = str + padWith;
			} else {
				str = padWith + str;
			}
		}
	}
	// if padWith was a multiple character string and str was overpadded
	if (padded && str.length > totalChars) {
		if (right) {
			str = str.substring(0, totalChars);
		} else {
			str = str.substring((str.length - totalChars), str.length);
		}
	}
	return str;
};

String.leftPad = function (str, totalChars, padWith) {
	return String.pad(str, totalChars, padWith, false);
};

String.rightPad = function (str, totalChars, padWith) {
	return String.pad(str, totalChars, padWith, true);
};

/*
 * Extend Date object functionality to allow parsing dates in "dd/mm/YYYY"
 * and return date in SQLite format 
 */
Date.prototype.toSqlFormat = function () {
	// Append a leading zero if day or moth is one digit long
	var day =  this.getDate() <= 9 ? '0' + this.getDate() : '' + this.getDate();
	var month =  this.getMonth()+1 <= 9 ? '0' + (this.getMonth()+1) : '' + (this.getMonth()+1);
	// Return date in YYYY-mm-dd format
	return this.getFullYear() + '-' + month + '-' + day;
};

Date.prototype.toString = function () {
	// Append a leading zero if day or moth is one digit long
	var day =  this.getDate() <= 9 ? '0' + this.getDate() : '' + this.getDate();
	var month =  this.getMonth()+1 <= 9 ? '0' + (this.getMonth()+1) : '' + (this.getMonth()+1);
	// Return date in dd/mm/YYYY format
	return day + '/' + month + '/' + this.getFullYear();
};

Date.isSqlDate = function (dateStr) {
	try {
		Date.parseSqlDate(dateStr);
	} catch (ex) {
		return false;
	}
	return true;
};

Date.parseDate = function (dateStr) {
	var dateArr = dateStr.split('/');
	if (dateArr.length !== 3 ||
			dateArr[2].length !== 4 ||
			dateArr[1].length !== 2 ||
			dateArr[0].length !== 2) {
		var details = 'Not a valid date';
		throw details;
	}
	var resultDate = new Date();
	resultDate.setFullYear(dateArr[2]);
	resultDate.setMonth(dateArr[1]-1);
	resultDate.setDate(dateArr[0]);
	return resultDate;
};

Date.parseSqlDate = function (dateStr) {
	var dateArr = dateStr.split('-');
	if (dateArr.length !== 3 ||
			dateArr[0].length !== 4 ||
			dateArr[1].length !== 2 ||
			dateArr[2].length !== 2) {
		var details = 'Not a valid date';
		throw details;
	}
	var resultDate = new Date();
	resultDate.setFullYear(dateArr[0]);
	resultDate.setMonth(dateArr[1]-1);
	resultDate.setDate(dateArr[2]);
	return resultDate;
};

js.repository.Datetime = function(wrappedDate) {
	this.wrappedDate = wrappedDate
	if (!this.wrappedDate) {
		this.wrappedDate = new Date();
	}
};

js.repository.Datetime.prototype.toSqlFormat = function () {
	// Append a leading zero if day or moth is one digit long
	var day = this.wrappedDate.getDate() <= 9 ? '0' + this.wrappedDate.getDate() : '' + this.wrappedDate.getDate();
	var month = this.wrappedDate.getMonth()+1 <= 9 ? '0' + (this.wrappedDate.getMonth()+1) : '' + (this.wrappedDate.getMonth()+1);
	var hours = String.leftPad(this.wrappedDate.getHours(),2,'0');
	var minutes = String.leftPad(this.wrappedDate.getMinutes(),2,'0');
	var seconds = String.leftPad(this.wrappedDate.getSeconds(),2,'0');
	var year = this.wrappedDate.getFullYear();
	// Return date in YYYY-mm-dd format HH:MM:SS
	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

js.repository.Datetime.prototype.toString = function () {
	// Append a leading zero if day or moth is one digit long
	var day = this.wrappedDate.getDate() <= 9 ? '0' + this.wrappedDate.getDate() : '' + this.wrappedDate.getDate();
	var month = this.wrappedDate.getMonth()+1 <= 9 ? '0' + (this.wrappedDate.getMonth()+1) : '' + (this.wrappedDate.getMonth()+1);
	var hours = String.leftPad(this.wrappedDate.getHours(),2,'0');
	var minutes = String.leftPad(this.wrappedDate.getMinutes(),2,'0');
	var seconds = String.leftPad(this.wrappedDate.getSeconds(),2,'0');
	var year = this.wrappedDate.getFullYear();
	// Return date in dd/mm/YYYY HH:MM:SS
	return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
};

js.repository.Datetime.isSqlDatetime = function (dateStr) {
	try {
		if (dateStr.charAt(4) !== '-' || dateStr.charAt(7) !== '-' ||
				dateStr.charAt(10) !== ' ' || dateStr.charAt(13) !== ':' ||
				dateStr.charAt(16) !== ':') {
			return false;
		}
		js.repository.Datetime.parseSqlDatetime(dateStr);
	} catch (ex) {
		return false;
	}
	return true;
};

js.repository.Datetime.parseDatetime = function (dateStr) {
	var resultDate = new Date();
	var year = parseInt(dateStr.substring(6,10), 10);
	var month = parseInt(dateStr.substring(3,5), 10)-1;
	var day = parseInt(dateStr.substring(0,2), 10);
	var hour = parseInt(dateStr.substring(11,13), 10);
	var minutes = parseInt(dateStr.substring(14,16), 10);
	var seconds = parseInt(dateStr.substring(17,20), 10);
	resultDate.setFullYear(year);
	resultDate.setMonth(month);
	resultDate.setDate(day);
	resultDate.setHours(hour, minutes, seconds);
	if(isNaN(resultDate.getTime())) {
		var details = 'Not a valid datetime';
		throw details;
	}
	return new js.repository.Datetime(resultDate);
};

js.repository.Datetime.parseSqlDatetime = function (dateStr) {
	var resultDate = new Date();
	var year = parseInt(dateStr.substring(0,4), 10);
	var month = parseInt(dateStr.substring(5,7), 10)-1;
	var day = parseInt(dateStr.substring(8,10), 10);
	var hour = parseInt(dateStr.substring(11,13), 10);
	var minutes = parseInt(dateStr.substring(14,16), 10);
	var seconds = parseInt(dateStr.substring(17,20), 10);
	resultDate.setFullYear(year);
	resultDate.setMonth(month);
	resultDate.setDate(day);
	resultDate.setHours(hour, minutes, seconds);
	if(isNaN(resultDate.getTime())) {
		var details = 'Not a valid datetime';
		throw details;
	}
	return new js.repository.Datetime(resultDate);
};

// Parse a String and evaualtes it as a chain method invocation or attribute access on a given root element
// Ex.: property = "Object1.Object2.Object3" -> Returns Object3
// Ex2.: property = "Object1.methodA('1', 2).toString()" -> Returns the result of calling toString() method
// on the result of calling methodA('1',2) on Entity.Object1
js.repository.parsePropertyChain = function (property, rootElement) {
	var propertyChainArr = property.split('.');
	var value = rootElement;
	for (var i = 0; i < propertyChainArr.length; i++) {
		var key = propertyChainArr[i];
		if (key.search('\\(') !== -1 && key.search('\\)') !== -1) {
			var methodName = key.substring(0, key.search('\\('));
			var parameters = key.substring(key.search('\\(') + 1, key.search('\\)'));
			var paramArr = eval("[" + parameters + "]");
			var method = value[methodName];
			value = method.apply(value, paramArr);
		} else {
			value = value[key];
		}
		if (value === null || value === undefined) {
			break;
		}
	}
	return value;
};

js.repository.Entity = function(entity) {
	this.isVO = true;
	this.plainEntity = entity;
	
	this.reloadProperties = function() {
		for (var key in this.plainEntity) {
			if (this.hasOwnProperty(key)) {
				this[key] = this.plainEntity[key];
			}
		}
	};
	
	this.saveProperties = function() {
		for (var key in this.plainEntity) {
			this.plainEntity[key] = this[key];
		}
	};
	
	this.getNullSafeProperty = function(property) {
		var value = js.repository.parsePropertyChain(property, this);
		return value ? value : "";
	};
};

js.repository.Repository = function (db, mapping) {
	this.db = db;
	this.mapping = mapping;
	
	this.newCriteria = function () {
		return new js.repository.JoinSupportCriteria(this.mapping);
	};
	
	this.toEntityArray = function (rs, entityType) {
		var entityArr = new Array();
		while (rs.isValidRow()) {
			var entity = new entityType();
			for (var prop in entity) {
				if (typeof entity[prop] != "function") {
					try {
						var value = rs.fieldByName(prop);
						if (Date.isSqlDate(value)) {
							entity[prop] = Date.parseSqlDate(value);
						} else if (js.repository.Datetime.isSqlDatetime(value)) {
							entity[prop] = js.repository.Datetime.parseSqlDatetime(value);
						} else {
							entity[prop] = value;
						}
					} catch(err) {
						var details = 'Unable to populate object, field "' + prop + '" doesn\'t exist in the ResultSet.';
						throw details;
					}
				}
			}
			entityArr.push(entity);
			rs.next();
		}
		return entityArr;
	};
	
	// Wrap the entity or entity array into ViewObjects
	this.toVO = function (targetObj) {
		var mappedTarget;
		if (targetObj.constructor === Array) {
			mappedTarget = [];
			for (var i = 0; i < targetObj.length; i++) {
				var a = this.applyMapping(targetObj[i], this.mapping);
				mappedTarget.push(a);
			}
		} else {
			mappedTarget = this.applyMapping(targetObj, this.mapping);
		}
		return mappedTarget;
	};
	
	// Unwraps the entity or entity array and returns plain entities
	this.toPlainEntity = function (targetObj) {
		var plainTarget;
		if (targetObj.constructor === Array) {
			plainTarget = [];
			for (var i = 0; i < targetObj.length; i++) {
				mappedTarget.push(this.toPlainEntity(targetObj[i]));
			}
		} else {
			if (targetObj.isVO) {
				targetObj.saveProperties();
				plainTarget = targetObj.plainEntity;
			} else {
				plainTarget = targetObj;
			}
		}
		return plainTarget;
	};
	
	this.applyMapping = function (entity, mapping, parentEntity, parentMapping) {
		// Wrap entity into a VO Entity, and leave it intact
		js.repository.Entity.prototype = entity;
		var Entity = new js.repository.Entity(entity);
		for (var key in mapping.references) {
			var result;
			// Inject the new property into the entity with NULL value by default
			// Will be populated with the RS results, else will be left null.
			Entity[key] = null;
			// Prevent a cyclic mapping by setting the parent entity instead of fetching it again
			if (parentMapping && mapping.references[key].mapping.tableName === parentMapping.tableName) {
				Entity[key] = parentEntity;
			}
			// If it's not a cyclic mapping, fetch the entity from DB and apply mappings to it
			else {
				var val = js.repository.Repository.parseValue(Entity[mapping.references[key].column]);
				var stmnt = "SELECT * FROM " + mapping.references[key].mapping.tableName + " WHERE " + mapping.references[key].referencedColumn + " = " + val;
				result = this.executeStatement(stmnt, mapping.references[key].mapping.entityType);
				// If RS returned only one result and it's not an inverse FK, set the
				// newly injected property as a plain object. Else set it as a collection.
				if (result.length === 1 && !mapping.references[key].inverse) {
					// Inject the the new subentity into the target VO
					Entity[key] = this.applyMapping(result[0], mapping.references[key].mapping);
				} else if (result.length > 0 || mapping.references[key].inverse) {
					// Array that contains all the mapped subentities
					var mappedResult = [];
					for (var i = 0; i < result.length; i++) {
						if (mapping.references[key].inverse) {
							mappedResult.push(this.applyMapping(result[i], mapping.references[key].mapping, Entity, mapping));
						} else {
							mappedResult.push(this.applyMapping(result[i], mapping.references[key].mapping));
						}
					}
					// Inject into VO the mapped subentities
					Entity[key] = mappedResult;
				}
			}
		}
		// Now inject new methods into Entity
		for (var key in mapping.methods) {
			Entity[key] = mapping.methods[key];
		}
		return Entity;
	};
	
	this.getAll = function () {
		return this.getByCriteria(new js.repository.Criteria());
	};
	
	// TODO
	this.getById = function (id) {
		var crit = new js.repository.Criteria();
		crit.addEqual(this.mapping.id, id);
		var entityArr = this.getByCriteria(crit);
		var entity = null;
		if (entityArr.length > 0) {
			entity = entityArr[0];
		}
		return entity;
	};
	
	this.add = function(sourceObj) {
		if (sourceObj.constructor === Array) {
			for (var i = 0; i < sourceObj.length; i++) {
				this.add(sourceObj[i]);
			}
		} else {
			var entity = sourceObj.isVO ? this.toPlainEntity(sourceObj) : sourceObj;
			var insert = "INSERT INTO ";
			var columns = "(";
			var values = " VALUES (";
			var first = true;
			for (var i in entity) {
				if (entity.hasOwnProperty(i)) {
					if (!first) {
						columns += ',';
						values += ',';
					} else {
						first = false;
					}
					columns += i;
					values += js.repository.Repository.parseValue(entity[i]);
				}
			}
			columns += ")";
			values += ")";
			var stmnt = insert + this.mapping.tableName + columns + values;
			this.executeStatement(stmnt);
			// Populate entity with insertion time values (autogenerated values, etc.)
			var lastInsertedObj = this.getLastInsertedObject();
			for (var key in lastInsertedObj) {
				if (entity[key] !== lastInsertedObj[key]) {
					entity[key] = lastInsertedObj[key];
				}
			}
			if (sourceObj.isVO) {
				sourceObj.reloadProperties();
			}
		}
	};
	
	this.remove = function(criteria) {
		var stmnt = "DELETE FROM " + this.mapping.tableName;
		if (criteria && !criteria.isEmpty()) {
			if (criteria.constructor === js.repository.Criteria) {
				stmnt += " WHERE " + criteria.toString();
			} if (criteria.constructor === js.repository.JoinSupportCriteria) {
				if (criteria && !criteria.isEmpty()) {
					stmnt += " WHERE " + this.mapping.id + " = (" + this.createStatement(criteria, this.mapping.id) + ")";
				}
			}
		}
		this.executeStatement(stmnt);
	};
	
	this.size = function (criteria) {
		var stmnt = "SELECT COUNT(*) count FROM (" + this.createStatement(criteria) + ")";
		return this.executeStatement(stmnt, function() {this.count = null;})[0].count;
	};
	
	this.createStatement = function (criteria, selectFieldsArr, optionalClausesArr) {
		var selectFields = "";
		if (selectFieldsArr && selectFieldsArr.length > 0) {
			for (var i = 0; i < selectFieldsArr.length; i++) {
				selectFields += this.mapping.tableName + "." + selectFieldsArr[i] + " ";
			}
		} else {
			selectFields = this.mapping.tableName + ".*";
		}
		var selectClause = "SELECT DISTINCT " + selectFields;
		var fromClause = " FROM " + this.mapping.tableName + " " + this.mapping.tableName;
		var joinClause = "";
		var whereClause = "";
		var optionalClauses = " "; // GROUP BY, HAVING, ORDER BY
		if (criteria && !criteria.isEmpty()) {
			whereClause += " WHERE " + criteria.toString();
			if (criteria.constructor === js.repository.JoinSupportCriteria) {
				var joinObj = criteria.getRequiredJoins();
				for (var key in joinObj) {
					joinClause += joinObj[key].toString();
				}
			}
		}
		if (optionalClausesArr) {
			optionalClauses += optionalClausesArr.join(" ");
		}
		var stmnt = selectClause + fromClause + joinClause + whereClause + optionalClauses;
		return stmnt;
	};

	this.getByCriteria = function (criteria, optionalClausesArr) {
		var stmnt = this.createStatement(criteria, null, optionalClausesArr);
		return this.executeStatement(stmnt);
	};
	
	this.getJsonByCriteria = function(criteria) {

		var entities = this.getByCriteria(criteria);
		var jsonArray = new Array();//[]
		for (i = 0; i < entities.length; i++) {
			var entity = entities[i];
			var row = "{'" + this.mapping.tableName + "':{";
			var first = true;
			for (var prop in entity) {
				var fieldValue = null;
				if (entity[prop] !== null) {
					if (entity[prop].toString()=='')//Fix for empty value
						fieldValue =null;
					else
						fieldValue = "\'" + entity[prop].toString() + "\'";
				}
				if (!first) {
					row += ",";
				} else {
					first = false;
				}
				row += "'" + prop + "':" + fieldValue;
			}
			row += "}}";
			jsonArray.push(row);
		}
		return jsonArray;
	};

	this.tableExists = function() {
		var exists = true;
		var statement = "SELECT * FROM sqlite_master WHERE type = 'table' AND name = '" + this.mapping.tableName + "'";
		try {
			var rs = this.db.execute(statement);
			if(!rs || !rs.isValidRow()){
				exists = false;
			}
		} catch (e){
			exists = false;
		} finally {
			if(rs) {
				try{
					rs.close();
				} catch(e) {}
			}
		}
		return exists;
	};
	
	this.executeQuery = function (stmnt, entityType) {
		return this.executeStatement(stmnt, entityType);
	};
	
	this.executeStatement = function (stmnt, entityType) {
		if (!entityType) {
			entityType = this.mapping.entityType;
		}
		try {
			var rs = this.db.execute(stmnt);
			var entityArr = [];
			if (rs) {
				entityArr = this.toEntityArray(rs, entityType);
			}
			return entityArr;
		} catch (ex) {
			throw(ex);
		} finally {
			if(rs) {
				try {
					rs.close();
				} catch(ex) {
				}
			}
		}
	};
	
	this.executeTransaction = function (wrappedFunction) {
		try {
			this.db.execute('BEGIN');
			wrappedFunction();
			this.db.execute('COMMIT');
		} catch (ex) {
			this.db.execute('ROLLBACK');
			throw(ex);
		}
	};
	
	this.getLastInsertedObject = function () {
		return this.executeStatement('SELECT * FROM ' + this.mapping.tableName + ' WHERE ROWID = (SELECT MAX(ROWID) FROM ' + this.mapping.tableName + ')')[0];
	};
	
	this.getQueryServiceDataByCriteria = function (criteria, toVO) {
		var entities = this.getByCriteria(criteria);
		var entities = toVO ? this.toVO(entities) : entities;
		var data = [];
		var i = 0;
		for (var i = 0; i < entities.length; i++) {
			data[i] = toQueryServiceHashMap(entities[i]);
		}
		return data;
	};
	
	function toQueryServiceHashMap(entity) {
		var map = new HashMap();
		for (var property in entity) {
			if (entity[property] && entity[property].isVO) {
				var submap = toQueryServiceHashMap(entity[property]);
				for (var key in submap.backing_hash) {
					map.put(property + '.' + key, submap.backing_hash[key]);
				}
			} else {
				map.put(property, entity[property]);
			}
		}
		return map;
	};
};

js.repository.Repository.parseValue = function (value) {
	var result = null;
	if (value !== null && value !== undefined) {
		if (value.constructor === String) {
			if (String.isNotEmpty(value)) {
				result = "\'" + value + "\'";
			}
		} else if (value.constructor === Number) {
			result = value;
		} else if (value.constructor === Date) {
			result = "date(\'" + value.toSqlFormat() + "\')";
		} else if (value.constructor === js.repository.Datetime) {
			result = "datetime(\'" + value.toSqlFormat() + "\')";
		} else {
			var details = 'Unparseable value: ' + value;
			throw details;
		}
	}
	return result;
};

js.repository.Criteria = function () {
	this.sql = '';
	
	this.addLike = function (field, value, isOr) {
		this.append(field + " like " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addLikeIgnoreCase = function (field, value, isOr) {
		this.append("UPPER(" + field + ") like UPPER(" + js.repository.Repository.parseValue(value) + ")", isOr);
	};
	
	this.addEqual = function (field, value, isOr) {
		this.append(field + " = " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addEqualIgnoreCase = function (field, value, isOr) {
		this.append("UPPER(" + field + ") = UPPER(" + js.repository.Repository.parseValue(value) + ")", isOr);
	};
	
	this.addNotEqual = function (field, value, isOr) {
		this.append(field + " <> " + js.repository.Repository.parseValue(value), isOr);
	};
		
	this.addNotEqualIgnoreCase = function (field, value, isOr) {
		this.append("UPPER(" + field + ") <> UPPER(" + js.repository.Repository.parseValue(value) + ")", isOr);
	};
	
	this.addGreaterThan = function (field, value, isOr) {
		this.append(field + " > " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addGreaterEqualThan = function (field, value, isOr) {
		this.append(field + " >= " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addLesserThan = function (field, value, isOr) {
		this.append(field + " < " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addLesserEqualThan = function (field, value, isOr) {
		this.append(field + " <= " + js.repository.Repository.parseValue(value), isOr);
	};
	
	this.addIn = function (field, values, isOr) {
		var stmnt = field + " IN (";
		for (var i = 0; i < values.length; i++) {
			if (i !== 0) {
				stmnt += ", ";
			}
			stmnt += js.repository.Repository.parseValue(values[i]);
		}
		stmnt += ")";
		this.append(stmnt, isOr);
	};
	
	this.addNotIn = function (field, values, isOr) {
		var stmnt = field + " NOT IN (";
		for (var i = 0; i < values.length; i++) {
			if (i !== 0) {
				stmnt += ", ";
			}
			stmnt += js.repository.Repository.parseValue(values[i]);
		}
		stmnt += ")";
		this.append(stmnt, isOr);
	};
	
	this.addIsNull = function (field, isOr) {
		this.append(field + " IS NULL", isOr);
	};
	
	this.addIsNotNull = function (field, isOr) {
		this.append(field + " IS NOT NULL", isOr);
	};
	
	this.addSubCriteria = function (subCriteria, isOr) {
		this.append(subCriteria, isOr);
	};
	
	this.addOrCriteria = function (subCriteria) {
		this.addSubCriteria(subCriteria, true);
	};
	
	this.addAndCriteria = function (subCriteria) {
		this.addSubCriteria(subCriteria, false);
	};

	this.append = function (subCriteria, isOr) {
		if (String.isNotEmpty(subCriteria.toString())) {
			if (String.isNotEmpty(this.sql)) {
				this.sql += ' ' + this.logicOp(isOr) + ' ';
			}
			if (subCriteria.constructor === String) {
				this.sql += subCriteria;
			} else if (subCriteria.constructor === js.repository.Criteria) {
				this.sql += '(' + subCriteria.toString() + ')';
			} else {
				var details = 'Invalid criteria type';
				throw details;
			}
		}
	};
	
	this.isEmpty = function() {
		return String.isEmpty(this.sql);
	};
	
	this.toString = function() {
		return this.sql.toString();
	};
	
	this.logicOp = function(isOr) {
		return (isOr ? js.repository.Criteria.OR : js.repository.Criteria.AND);
	};
	
};
js.repository.Criteria.OR = 'OR';
js.repository.Criteria.AND = 'AND';

js.repository.JoinSupportCriteria = function (mapping) {
	this.joinOperations = {}; // Join map with table to be joined as key
	this.mapping = mapping;
	
	this.parseProperty = function (property) {
		var propertyArr = property.split(".");
		var mapping = this.mapping; // Root mapping
		if (propertyArr.length > 1) {
			for (var j = 0; j < propertyArr.length-1; j++) {
				var ref;
				if (mapping.references) {
					ref = mapping.references[propertyArr[j]]; // Reference
				}
				if (!ref) { // If reference is non existent, throw an exception
					var details = "No valid mapping reference: " + propertyArr[j];
					throw details;
				}
				var joinedTableName = ref.mapping.tableName; // Joined table name
				if (!this.joinOperations[joinedTableName]) { // Add subcriterias joins if it does not already exist.
					var joinCondition = joinedTableName + "." + ref.referencedColumn + " = " + mapping.tableName + "." + ref.column;	
					this.joinOperations[joinedTableName] = " JOIN " + joinedTableName + " ON " + joinCondition;
				}
				mapping = ref.mapping;
			}
		}
		return mapping.tableName + "." + propertyArr[propertyArr.length-1];
	};
	
	this.getRequiredJoins = function() {
		return this.joinOperations;
	};
	
	this.addJoins = function(subCriteria) {
		var joins = subCriteria.joinOperations;
		for (var key in joins) {
			if (!this.joinOperations[key]) {
				this.joinOperations[key] = joins[key];
			}
		}
	};
	
	// Adds any criterion, the passed criterion should only implement a toString method.
	// Be sure to call parseProperty appropriately if a JOIN has to be performed in order
	// to evaluate the passed criterion.
	var _append = this.append;
	this.append = function(subCriteria, isOr) {
		if (subCriteria.constructor === js.repository.JoinSupportCriteria) {
			if (String.isNotEmpty(this.sql)) {
				this.sql += ' ' + this.logicOp(isOr) + ' ';
			}
			this.sql += '(' + subCriteria.toString() + ')';
			this.addJoins(subCriteria);
		} else {
			_append.call(this, subCriteria, isOr);
		}
	};
	
	var overridenMethods = ['addLike', 'addLikeIgnoreCase', 'addEqual', 'addEqualIgnoreCase', 'isNull', 'isNotNull', 'addNotEqual', 
							'addNotEqualIgnoreCase', 'addGreaterThan', 'addGreaterEqualThan', 'addLesserThan', 'addLesserEqualThan', 
							'addIn', 'addNotIn'];
	for (var superMethod in this) {
		for (var i = 0; i < overridenMethods.length; i++) {
			if (overridenMethods[i] === superMethod) {
				this['_' + superMethod] = this[superMethod];
				eval("this[superMethod] = function() {arguments[0] = this.parseProperty(arguments[0]);this."+'_'+superMethod+".apply(this, arguments);};");
				break;
			}
		}
	}
	
};
js.repository.JoinSupportCriteria.prototype = new js.repository.Criteria();
js.repository.JoinSupportCriteria.prototype.constructor = js.repository.JoinSupportCriteria;