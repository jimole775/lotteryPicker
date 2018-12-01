module.exports = {
    hasExist: function (origin, tag, prop) {
            var isExist = false;
            if (this.isArray(origin)) {
                var i = origin.length;
                while (i--) {
                    if (prop) {
                        if (origin[prop] === tag[prop]) {
                            isExist = true;
                            break;
                        }
                    } else {
                        if (origin === tag) {
                            isExist = true;
                            break;
                        }
                    }
                }
            }

            if (this.isString(origin)) {
                if (typeof tag === "object" && typeof prop === "string") {
                    isExist = origin.indexOf(tag[prop]) > -1;
                } else {
                    isExist = origin.indexOf(tag) > -1;
                }
            }

            if (this.isObject(origin)) {
                if (typeof tag === "object" && typeof prop === "string") {
                    var realTag = tag[prop];
                    isExist = origin[realTag];
                } else {
                    isExist = origin[tag];
                }
            }

            return isExist;
        }

        ,
    isFunction: function (functionLike) {
            return Object.prototype.toString.call(functionLike) === '[object Function]';
        }

        ,
    isObject: function (objectLike) {
            return Object.prototype.toString.call(objectLike) === '[object Object]';
        }

        ,
    isArray: function (arrayLike) {
            return Object.prototype.toString.call(arrayLike) === '[object Array]';
        }

        ,
    isString: function (stringLike) {
            return Object.prototype.toString.call(stringLike) === '[object String]';
        }
        ,
    isMap: function (mapLike) {
            return Object.prototype.toString.call(mapLike) === '[object Map]';
        }
        ,
    isSet: function (setLike) {
            return Object.prototype.toString.call(setLike) === '[object Set]';
        }

        ,
    isNumber: function (numberLike) {
            return Object.prototype.toString.call(numberLike) === '[object Number]';
        }

        ,
    isBoolean: function (booleanLike) {
            return Object.prototype.toString.call(booleanLike) === '[object Boolean]';
        }

        ,
    isNull: function (nullLike) {
            return Object.prototype.toString.call(nullLike) === '[object Null]';
        }

        ,
    isUndefined: function (undefinedLike) {
            return Object.prototype.toString.call(undefinedLike) === '[object Undefined]';
        }

        ,
    isNumberString: function (numberStringLike) {
            return this.isString(numberStringLike) && !isNaN(Number(numberStringLike));
        }

        ,
    isUpper: function (code) {
            return this.isString(code) && code === code.toUpperCase();
        }

        ,
    isEmpty: function (item) {
            var result = null;
            try {
                if (this.isObject(item)) {
                    result = JSON.stringify(item).length === 2;
                }
                if (this.isString(item)) {
                    result = item.length === 0;
                }
                if (item === null || item === undefined) {
                    result = true;
                }
            } catch (e) {
                console.log(e.message);
            }
            return result;
        }

        ,
    countDown: function (time, result, callback) {
            var countDownStorage = commonStorage.countDown;
            time = Math.abs(parseInt(time));
            stopCounting();
            startCounting(time, result);
            fillValue(time, result);

            function startCounting(time, result) {
                countDownStorage.thisCounter = setInterval(function () {
                    time--;
                    if (time <= 0) {
                        stopCounting();
                        clearValue(result);
                        applyCallback(callback);
                        return;
                    }
                    fillValue(time, result);
                }, 1000);

                return stopCounting;
            }

            function fillValue(time, result) {
                result.innerText = time;
            }

            function stopCounting() {
                clearInterval(countDownStorage.thisCounter);
                countDownStorage.thisCounter = null;
            }

            function applyCallback(callback) {
                if (callback && typeof callback === "function") callback();
            }

            function clearValue(result) {
                result.innerText = "";
            }

        }

        /**
         * @multiHead:  ::基础样本必须包含以下3个字段的树形
         *              ::[{ key:"x",value:"x",children:[{}...]}...]
         * @maxLayer:   ::指定表头最大行数
         * @return:     ::[[{},{}]...];
         * */
        ,
    multiHeadTransform: function (multiHeadTree, maxLayer, renderEntries) {

            var result = [];

            loop(null, multiHeadTree, maxLayer, 0, 0);

            function loop(parent, stepOriginData, maxLayer, stepLayer) {

                // 默认初始层级为0
                var curLayer = stepLayer === undefined ? 0 : stepLayer;

                stepOriginData.forEach(function (stepOriginDataItem) {
                    if (!result[curLayer]) result[curLayer] = [];

                    // 单元格数据模型
                    var modeCell = {
                        colSpan: 1, // if(hasChildren) children.length;
                        rowSpan: 1, // if(noChildren) maxLayer - level;
                        key: stepOriginDataItem.key,
                        value: stepOriginDataItem.value,
                        level: curLayer,
                        parentKey: parent ? parent.key : null,
                        isRender: true
                    };

                    result[curLayer].push(modeCell);

                    if (stepOriginDataItem.children && stepOriginDataItem.children.length > 0) {

                        // 如果有子集，就以子集的个数来标记自身的colSpan值
                        // （只是临时标记逐层的关系，因为在当前递归中无法确定第一行和第三行的关系）
                        // rowSpan就默认为1，不用修改
                        modeCell.colSpan = stepOriginDataItem.children.length;

                        loop(stepOriginDataItem, stepOriginDataItem.children, maxLayer, curLayer + 1);
                    } else {

                        // 如果没有子集，就以最大行数减去当前递归的层数来标记自身rowSpan值（这个逻辑看视图会比较清晰）
                        // colSpan默认为1，不用修改
                        modeCell.rowSpan = maxLayer - curLayer;
                    }
                });
            }

            var len = result.length;
            var colMarkMap = {};

            // 从下往上遍历，根据parentKey的关系，计算汇总每层的最终colSpan值
            // 最终记录到对应的map
            while (len--) {
                var peerRow = result[len];
                peerRow.forEach(function (cellItem) {
                    if (colMarkMap[cellItem.parentKey] === undefined) colMarkMap[cellItem.parentKey] = 0;
                    colMarkMap[cellItem.parentKey] += cellItem.colSpan;
                });
            }

            // 最后再匹配map的记录
            var len1 = result.length;
            while (len1--) {
                var peerRow1 = result[len1];
                peerRow1.forEach(function (cellItem) {
                    cellItem.colSpan = colMarkMap[cellItem.key] ? colMarkMap[cellItem.key] : 1;
                });
            }

            if (renderEntries) {
                var renderFields = this.isArray(renderEntries) ? renderEntries : this.getObjectKeys(renderEntries);
                var parentRenderFields = [];
                renderFields.forEach(function (field) {
                    result.forEach(function (peerRow) {
                        peerRow.forEach(function (cellItem) {
                            if (cellItem.key === field) {
                                cellItem.isRender = true;
                                if (parentRenderFields.indexOf(cellItem.parentKey) === -1)
                                    parentRenderFields.push(cellItem.parentKey);
                            }
                        });
                    })
                });

                parentRenderFields.forEach(function (field) {
                    result.forEach(function (peerRow) {
                        peerRow.forEach(function (cellItem) {
                            if (cellItem.key === field) {
                                cellItem.isRender = true;
                            }
                        });
                    })
                });

                result.forEach(function (peerRow) {
                    peerRow.forEach(function (cellItem, cellIndex) {
                        if (!cellItem.isRender) {
                            peerRow.splice(cellIndex, 1);
                        }
                    });
                })
            }

            return result;
        }

        ,
    getRenderFieldFromMultiHeadEntries: function (multiHeadTree) {
            var keyArr = [];
            var valueArr = [];

            loop(multiHeadTree, keyArr, valueArr);

            function loop(curLevelArray, keyArr, valueArr) {
                curLevelArray.forEach(function (curLevelItem, topLevelIndex) {
                    if (curLevelItem.children && curLevelItem.children.length) {
                        loop(curLevelItem.children, keyArr, valueArr);
                    } else {
                        keyArr.push(curLevelItem.key);
                        valueArr.push(curLevelItem.value);
                    }
                });
            }

            // function spillMap(keyArr,valueArr){
            //     var result = {};
            //     keyArr.forEach(function(key,index){
            //         result[key] = valueArr[index];
            //     });
            //     return result;
            // }

            return keyArr;
        }

        /**
         * @originData(*必填)[Array|Object]   ::输入数据,模型：[{a:"",b:""},{a:"",b:""}] or {a:{},b:{}}
         * @renderField(*必填)[Object|Array]  ::实体字段，这里的有的字段，输出数据时，isRender属性都会默认为true
         * @rowMark(*必填)[String|Number]     ::每一行的标记，会根据这里提供的字段名所获取到的值来作为标记
         * @isMergeCell[Boolean]             ::是否对所有列的单元格进行合并,默认不合并
         * @disableMergedCols[Array(String)] ::提供列的合并例外，以字段名来标记
         * @reverseSortedCols[Array(String)] ::提供列的升序例外(例外为降序)，以字段名来标记
         * @routerBlackCols[Array(String)]   ::提供列的路由跳转例外，以字段名来标记
         * @hiddenCols[Array(String)]        ::提供列的渲染例外，只要声明在这里，最后输出数据时，isRender属性都设置为false
         * @return[Array]
         * */
        ,
    multiBodyTransform: function (params) {

            var originData = params.originData;
            var renderField = params.renderField;
            var rowMark = params.rowMark;
            var isMergeCell = params.isMergeCell;

            var disableMergedCols = params.disableMergedCols ? params.disableMergedCols : [];
            var reverseSortedCols = params.reverseSortedCols ? params.reverseSortedCols : [];
            var routerBlackCols = params.routerBlackCols ? params.routerBlackCols : [];
            var hiddenCols = params.hiddenCols ? params.hiddenCols : [];
            var insertIconCols = params.insertIconCols ? params.insertIconCols : [];
            var fakedRateCols = params.fakedRateCols ? params.fakedRateCols : [];

            var cellItemModel = {
                value: "", // 最终的视图
                columnKey: "", // 每一列的标记字段
                rowKey: "", // 每一行的标记字段，如果用户不进行定制，就默认使用原数据的数组下标
                colSequencing: 0, //列排序下标
                rowSequencing: 0, //行排序下标
                isRate: false, // 当前的值是否是百分比的值，
                // 百分比的值--虽然业务逻辑上它还是数值，
                // 但是处理逻辑上它是个字符串，最后处理的时候要加上百分号
                isFakedRate: false, // 这个值用于享受rate的判断条件，但是最终显示的时候不带%号
                isRender: true, // 当前单元格是否渲染,默认可渲染
                isNumber: false, // 判断纯数值
                isRouting: true, // 当前单元格是否有跳转行为,默认可跳转
                isInsertIcon: false // 用于允许插入额外的小图标在当前单元格
            };

            // 过滤一下渲染字段类型，最终取用的是key数组
            renderField = this.isArray(renderField) ? renderField : this.getObjectKeys(renderField);

            function getAllRowView() {
                var viewOriginDataArray = [];

                Object.keys(originData).forEach(function (originDataKey, rowIndex) {
                    var newRowArray = [];
                    var peerRow = originData[originDataKey];
                    // 循环单行对象

                    renderField.forEach(function (renderKey, totalRowSequencing) {
                        newRowArray.push(createCellItem(peerRow, renderKey, rowIndex, totalRowSequencing));
                    });

                    viewOriginDataArray.push(_.sortBy(newRowArray, "rowSequencing"));
                });

                return viewOriginDataArray;
            }

            function createCellItem(peerRow, renderKey, rowIndex, totalRowSequencing) {

                // 过滤无意义数据
                peerRow[renderKey] = peerRow[renderKey] === null ? "" : peerRow[renderKey];
                peerRow[renderKey] = peerRow[renderKey] === undefined ? "" : peerRow[renderKey];

                // 根据提供的字段实体来裁剪最终数据
                var newValue = peerRow[renderKey];
                var isRate = false;
                var isInsertIcon = false;
                var isFakedRate = false;
                var isRouting = true;
                var isNumber = false;
                var isRender = true;

                // 判断如果值有%，就过滤掉,设置isRate值
                // 在ng-bind的时候，判断isRate字段为true，就加%，显示
                if (newValue.toString().indexOf("%") >= 0) {
                    newValue = parseFloat(newValue.substring(0, newValue.length - 1));
                    isRate = true;
                }

                if (insertIconCols.indexOf(renderKey) > -1) {
                    isInsertIcon = true;
                }

                if (fakedRateCols.indexOf(renderKey) > -1) {
                    isFakedRate = true;
                }

                // 如果每一项的数据结果是0，或者被存为黑名单，就不需要路由跳转
                if (newValue === 0 || routerBlackCols.indexOf(renderKey) > -1) {
                    isRouting = false;
                }

                // 把字串类型的数字转成数字类型，方便ng排序
                if (!isNaN(newValue)) {
                    isNumber = true;
                }

                // 是否隐藏元素
                if (hiddenCols.indexOf(renderKey) > -1) {
                    isRender = false;
                }

                var cloneModel = JSON.parse(JSON.stringify(cellItemModel));

                cloneModel.value = newValue;
                cloneModel.isRate = isRate;
                cloneModel.colSequencing = 0; // 这个值必须对每一列进行排序之后才能得到
                cloneModel.rowSequencing = totalRowSequencing;
                cloneModel.columnKey = renderKey;
                cloneModel.rowKey = peerRow[rowMark] || rowIndex;
                cloneModel.isRender = isRender;
                cloneModel.isRouting = isRouting;
                cloneModel.isInsertIcon = isInsertIcon;
                cloneModel.isFakedRate = isFakedRate;
                cloneModel.isNumber = isNumber;

                return cloneModel;
            }

            function getAllColView(allRowView) {
                // 首先循环一遍，把相同的项存成一个数组，统一key值
                var allColView = {};
                allRowView.forEach(function (peerRow, colIndex) {
                    peerRow.forEach(function (singleItem, rowIndex) {

                        var key = singleItem.columnKey;
                        if (allColView[key]) {
                            allColView[key].push(singleItem);
                        } else {
                            allColView[key] = [];
                            allColView[key].push(singleItem);
                        }

                    });
                });

                return allColView;
            }

            function sortingColView(allColView, reverseSortedCols) {
                // 遍历一遍allColView，对列进行排序，添加标记
                Object.keys(allColView).forEach(function (key, index) {
                    var curCol = allColView[key];

                    // 根据每一列的值先排个序
                    curCol = _.sortBy(curCol, "value");

                    var objLen = curCol.length;
                    var iterats = objLen;
                    while (iterats--) {

                        if (reverseSortedCols.indexOf(key) > -1) {
                            curCol[iterats].colSequencing = iterats;
                        } else {
                            // 添加列序号标记
                            curCol[iterats].colSequencing = objLen - iterats - 1;
                        }

                    }
                });
                return allColView;
            }

            function mergeRowSpan(allColView) {

                Object.keys(allColView).forEach(function (colKey) {

                    var countDupStartIndex = 0;
                    var countDupSum = 1; // 默认行数

                    var curColView = allColView[colKey];
                    curColView.forEach(function (colCellItem, colCellIndex) {

                        // 根据定制，来取消合并的列
                        if (disableMergedCols.indexOf(colCellItem.columnKey) > -1) {
                            colCellItem.rowSpan = 1;
                            colCellItem.colSpan = 1;
                            colCellItem.relativeRowKey = colCellItem.rowKey;
                            return;
                        }

                        var nextItem = curColView[colCellIndex + 1];

                        // 比对当前和下一项的值,
                        // 如果相同，就把 countDupSum 加1，最后赋值给重复的起始位的单元格
                        if (nextItem && colCellItem.value === nextItem.value) {
                            countDupSum++;
                            nextItem.isRender = false;
                            nextItem.rowSpan = 1;
                            nextItem.colSpan = 1;
                            nextItem.relativeRowKey = curColView[countDupStartIndex].rowKey;

                        } else {
                            curColView[countDupStartIndex].relativeRowKey = curColView[countDupStartIndex].rowKey;
                            curColView[countDupStartIndex].rowSpan = countDupSum;
                            curColView[countDupStartIndex].colSpan = 1;
                            countDupSum = 1;
                            countDupStartIndex = colCellIndex + 1; // 把起始下标往下挪一位
                        }

                    });
                });

                return allColView;
            }

            function colAndRowInteraction(allRowView, allColView) {
                // 循环比对，然后把对应的修改项插回展示数组
                var i = allRowView.length;
                while (i--) { // 循环行
                    var rowItem = allRowView[i];
                    Object.keys(allColView).forEach(function (key, rowIndex) {
                        var colItem = allColView[key];
                        var colIndex = colItem.length;

                        while (colIndex--) { // 循环列

                            // 如果colName和rowName这二维值相同，就代表可以覆盖原项
                            if (colItem[colIndex].columnKey === rowItem[rowIndex].columnKey &&
                                colItem[colIndex].rowKey === rowItem[rowIndex].rowKey) {
                                rowItem[rowIndex] = colItem[colIndex];
                            }

                        }

                    });
                }

                return allRowView;
            }

            var baseRowEntries = getAllRowView();
            var baseColEntries = getAllColView(baseRowEntries);
            var colEntriesAfterSorted = sortingColView(baseColEntries, reverseSortedCols);
            var colEntriesAfterMergeRowSpan = isMergeCell ? mergeRowSpan(colEntriesAfterSorted) : colEntriesAfterSorted;

            return colAndRowInteraction(baseRowEntries, colEntriesAfterMergeRowSpan);
        }

        ,
    multiBodyTransformRollback: function (dataView) {
            var result = null;
            if (this.isArray(dataView[0])) {
                result = [];
                dataView.forEach(function (peerRow) {
                    var result_Row = {};
                    peerRow.forEach(function (cellItem) {
                        result_Row[cellItem.columnKey] = cellItem.value;
                    });
                    result.push(result_Row);
                });
            } else if (this.isObject(dataView[0])) {
                result = {};
                dataView.forEach(function (cellItem) {
                    result[cellItem.columnKey] = cellItem.value;
                });
            }
            return result;
        }

        ,
    buildRandomData: function (dataModel, rows, fixedField) {

            rows = rows ? rows : (suffix(20) + 1);
            fixedField = fixedField ? fixedField : "index";

            var result = [];
            var zhCode = "7684_4e00_4e86_662f_6211_4e0d_5728_4eba_4eec_6709_6765_4ed6_8fd9_4e0a_7740_4e2a_5730_5230_5927_91cc_8bf4_5c31_53bb_5b50_5f97_4e5f_548c_90a3_8981_4e0b_770b_5929_65f6_8fc7_51fa_5c0f_4e48_8d77_4f60_90fd_628a_597d_8fd8_591a_6ca1_4e3a_53c8_53ef_5bb6_5b66_53ea_4ee5_4e3b_4f1a_6837_5e74_60f3_751f_540c_8001_4e2d_5341_4ece_81ea_9762_524d_5934_9053_5b83_540e_7136_8d70_5f88_50cf_89c1_4e24_7528_5979_56fd_52a8_8fdb_6210_56de_4ec0_8fb9_4f5c_5bf9_5f00_800c_5df1_4e9b_73b0_5c71_6c11_5019_7ecf_53d1_5de5_5411_4e8b_547d_7ed9_957f_6c34_51e0_4e49_4e09_58f0_4e8e_9ad8_624b_77e5_7406_773c_5fd7_70b9_5fc3_6218_4e8c_95ee_4f46_8eab_65b9_5b9e_5403_505a_53eb_5f53_4f4f_542c_9769_6253_5462_771f_5168_624d_56db_5df2_6240_654c_4e4b_6700_5149_4ea7_60c5_8def_5206_603b_6761_767d_8bdd_4e1c_5e2d_6b21_4eb2_5982_88ab_82b1_53e3_653e_513f_5e38_6c14_4e94_7b2c_4f7f_5199_519b_5427_6587_8fd0_518d_679c_600e_5b9a_8bb8_5feb_660e_884c_56e0_522b_98de_5916_6811_7269_6d3b_90e8_95e8_65e0_5f80_8239_671b_65b0_5e26_961f_5148_529b_5b8c_5374_7ad9_4ee3_5458_673a_66f4_4e5d_60a8_6bcf_98ce_7ea7_8ddf_7b11_554a_5b69_4e07_5c11_76f4_610f_591c_6bd4_9636_8fde_8f66_91cd_4fbf_6597_9a6c_54ea_5316_592a_6307_53d8_793e_4f3c_58eb_8005_5e72_77f3_6ee1_65e5_51b3_767e_539f_62ff_7fa4_7a76_5404_516d_672c_601d_89e3_7acb_6cb3_6751_516b_96be_65e9_8bba_5417_6839_5171_8ba9_76f8_7814_4eca_5176_4e66_5750_63a5_5e94_5173_4fe1_89c9_6b65_53cd_5904_8bb0_5c06_5343_627e_4e89_9886_6216_5e08_7ed3_5757_8dd1_8c01_8349_8d8a_5b57_52a0_811a_7d27_7231_7b49_4e60_9635_6015_6708_9752_534a_706b_6cd5_9898_5efa_8d76_4f4d_5531_6d77_4e03_5973_4efb_4ef6_611f_51c6_5f20_56e2_5c4b_79bb_8272_8138_7247_79d1_5012_775b_5229_4e16_521a_4e14_7531_9001_5207_661f_5bfc_665a_8868_591f_6574_8ba4_54cd_96ea_6d41_672a_573a_8be5_5e76_5e95_6df1_523b_5e73_4f1f_5fd9_63d0_786e_8fd1_4eae_8f7b_8bb2_519c_53e4_9ed1_544a_754c_62c9_540d_5440_571f_6e05_9633_7167_529e_53f2_6539_5386_8f6c_753b_9020_5634_6b64_6cbb_5317_5fc5_670d_96e8_7a7f_5185_8bc6_9a8c_4f20_4e1a_83dc_722c_7761_5174_5f62_91cf_54b1_89c2_82e6_4f53_4f17_901a_51b2_5408_7834_53cb_5ea6_672f_996d_516c_65c1_623f_6781_5357_67aa_8bfb_6c99_5c81_7ebf_91ce_575a_7a7a_6536_7b97_81f3_653f_57ce_52b3_843d_94b1_7279_56f4_5f1f_80dc_6559_70ed_5c55_5305_6b4c_7c7b_6e10_5f3a_6570_4e61_547c_6027_97f3_7b54_54e5_9645_65e7_795e_5ea7_7ae0_5e2e_5566_53d7_7cfb_4ee4_8df3_975e_4f55_725b_53d6_5165_5cb8_6562_6389_5ffd_79cd_88c5_9876_6025_6797_505c_606f_53e5_533a_8863_822c_62a5_53f6_538b_6162_53d4_80cc_7ec6";
            var letterCode = "41_42_43_44_45_46_47_48_49_4a_4b_4c_4d_4e_4f_50_51_52_53_54_55_56_57_58_59_5a";

            var zhCodeArray = zhCode.split("_");
            var letterCodeArray = letterCode.split("_");

            var eventMap = {
                EN: createEN //创建随机英文序列，格式：CSDN-XXXX
                    ,
                CN: createCN //创建随机5个中文，格式：XXXXX
                    ,
                NAME: createName //创建随机中文名字，格式：XXX
                    ,
                DATE: createDate //创建随机日期，格式：XXXX-XX-XX
                    ,
                RATE: createRate //创建随机概率数，格式：XX%
                    ,
                DESC: createDescription //创建描述语句，格式：XXXXX，XXX，XXXXX
                    ,
                SERIAL: createSerial //创建随机编号序列，格式：PMS-0000XXXX
                    ,
                NUMBER: createNumberOnBit //创建随机4位数字，格式：XXXX
                    ,
                REGEX: createRandomElementByRegex //根据提供的正则，取其中的随机元素
            };

            var fieldEntries = dataModel instanceof Array ? dataModel[0] : dataModel;
            while (rows--) {
                var rowMode = {};
                Object.keys(fieldEntries).forEach(function (fieldKey, index) {
                    var dataType = fieldEntries[fieldKey];

                    // 如果判断字符被[]包裹，就当作正则解析出一个随机元素
                    if (dataType.indexOf("[") === 0 && dataType.indexOf("]") === dataType.length - 1) {
                        return rowMode[fieldKey] = eventMap["REGEX"](dataType)
                    }

                    // 一般来说，选择一列固定的话，逐行添加下标
                    if (fieldKey === fixedField) {
                        rowMode[fieldKey] = result.length;
                    } else {
                        console.log(dataType);
                        var eventFn = eventMap[dataType] || eventMap["CN"];
                        rowMode[fieldKey] = eventFn();
                    }
                });

                result.push(rowMode);
            }

            return result;

            function createSerial() {
                return "PMS" + "_" + "0000" + createNumberOnBit(4);
            }

            function createCN(max) {
                max = max ? max : 5;
                return createAPhrase(zhCodeArray, max);
            }

            function createRandomElementByRegex(regex) {
                // regex类型为 [A|B|C]
                var string = regex.substr(1, regex.length - 2);
                var collection = string.split("|");
                return collection[suffix(collection.length)];
            }

            function createDescription(phraseSum) {
                console.log("dsds");
                phraseSum = phraseSum ? phraseSum : (suffix(3) + 1);
                var result = "";
                var phraseBreak = "，";
                while (phraseSum--) {
                    result += createAPhrase(zhCodeArray, 10) + phraseBreak;
                }
                return result;
            }

            function createEN() {
                return "CSDN" + "-" + createAPhrase(letterCodeArray, 4);
            }

            function createDate() {
                var nowDate = new Date();
                var yy = nowDate.getFullYear();
                // var mm = nowDate.getMonth() + 1;
                // var dd = nowDate.getDay();
                return yy + "-" + createMon(12) + "-" + createDay(30);

                function createMon(limit) {
                    var result = (suffix(limit - 1) + 1).toString();
                    return result.length === 1 ? "0" + result : result;
                }

                function createDay(limit) {
                    var result = (suffix(limit - 1) + 1).toString();
                    return result.length === 1 ? "0" + result : result;
                }

            }

            function createRate() {
                return createNumberOnBit(2) + "%";
            }

            function createName() {
                var firstName = "赵-钱-孙-李-周-吴-郑-王-蒋-沈-韩-杨-白-梁-容-荣-陈-张-黄-何-杜-姜-冯-郭-刘-曾-孔-王-顾-欧阳-慕容-诸葛-令狐-公孙-司马";
                var lastName = createAPhrase(zhCodeArray, 2);
                var firstNameArr = firstName.split("-");
                return firstNameArr[suffix(firstNameArr.length)] + lastName;
            }

            function createNumberOnBit(limit) {
                var result = "";
                limit = limit ? limit : 4;
                while (limit--) {
                    result += Math.floor(Math.random() * 10).toString();
                }
                return result;
            }

            function createAPhrase(_unicodeMap, len) {
                len = len ? len : suffix(3) + 1;
                var phrase = "";
                while (len--) {
                    phrase += spillAWord(_unicodeMap);
                }

                return phrase;
            }

            function spillAWord(_unicodeMap) {
                var wordCode = suffix(_unicodeMap.length);
                return String.fromCharCode("0x" + _unicodeMap[wordCode]);
            }

            function suffix(max) {
                max = max ? max : 10000;
                return Math.floor(Math.random() * max);
            }
        }

        ,
    sortedByModel: function (originData, model) {
            var result = null;
            if (this.isObject(model)) {
                model = this.getObjectKeys(model);
            }
            if (this.isArray(originData)) {
                result = [];
                originData.forEach(function (originDataItem) {
                    var singleModel = {};
                    model.forEach(function (modelItem) {
                        Object.keys(originDataItem).forEach(function (key) {
                            if (modelItem === key) {
                                singleModel[modelItem] = originDataItem[key];
                            }
                        })
                    });
                    result.push(singleModel);
                });
            } else if (this.isObject(originData)) {
                result = {};
                model.forEach(function (modelItem) {
                    Object.keys(originData).forEach(function (key) {
                        if (modelItem === key) {
                            result[modelItem] = originData[key];
                        }
                    })
                });
            }
            return result;
        }

        ,
    rightMenu: function (eventTarget, showTemplate, callback) {

            clearAlertWhenClickBody("." + showTemplate.className);

            eventTarget.oncontextmenu = function (e) {

                if (showTemplate && showTemplate.style) {

                    // 优先显示，才有高宽可以获取
                    // 原因可能出现在模板生成处！
                    showTemplate.style.display = "block";
                    showTemplate.style.opacity = 0;

                    var maxHeight = document.documentElement.clientHeight;
                    var maxWidth = document.documentElement.clientWidth;
                    var showTplHeight = showTemplate.offsetHeight;
                    var showTplWidth = showTemplate.offsetWidth;

                    // 在鼠标右上方的位置
                    // var isBeyondDistance = e.clientY - showTplHeight - maxHeight;
                    // var topValue = isBeyondDistance > 0 ? e.clientY - showTplHeight - isBeyondDistance : e.clientY - showTplHeight;
                    // topValue = e.clientY - showTplHeight < 0 ? 0 : topValue;

                    // 在鼠标右下方的位置
                    var isBeyondDistance = e.clientY + showTplHeight - maxHeight;
                    var topValue = isBeyondDistance > 0 ? maxHeight - showTplHeight : e.clientY;

                    isBeyondDistance = e.clientX + showTplWidth > maxWidth;
                    var leftValue = isBeyondDistance > 0 ? e.clientX - showTplWidth : e.clientX;
                    showTemplate.style.opacity = 1;
                    showTemplate.style.position = "fixed";
                    showTemplate.style.zIndex = "9991";
                    showTemplate.style.top = topValue + "px";
                    showTemplate.style.left = leftValue + "px";

                    if (callback && callback instanceof Function) {
                        callback(searchingTr(e.target));
                    }

                    return false;
                }

            };


            function searchingTr(target) {

                if (target.nodeName !== "TR") {
                    target = searchingTr(target.parentNode);
                }

                return target;
            }
        }

        /**
         * @fieldEntries: ::{key:value,key:value...}
         * @return:       ::[key,key...]
         * */
        ,
    getObjectKeys: function (fieldEntries) {
            var result = [];
            if (this.isObject(fieldEntries)) {
                Object.keys(fieldEntries).forEach(function (entriesKey, index) {
                    result.push(entriesKey);
                });
            } else {
                result = fieldEntries;
            }
            return result;
        }

        /**
         * 这里要明白，我们所谓的渲染就是动态拼接一个html模板，来对应directive在html中的状态
         * @name[String]        ::指令名
         * @props[Object]       ::对应html标签的属性，提供一个正常的键值对
         * @replace[Boolean]    ::是否要替换已有的指令，如果不设置，就默认只渲染一次
         * @env[Scope]          ::父级的$scope对象
         * @container[Element]  ::需要插入的位置，如果不设置，默认查找父级是否有 @name + 'Container' 这个ID,如果没有，抛出错误
         * @callback[Function]  ::回调
         * @return[callback]
         * */
        ,
    renderDirective: function (customList) {
            // var delayTime = customList.delay;
            // var isReplace = customList.replace;
            // var props = customList.props;
            // var directiveName = customList.name;
            // var parentScope = customList.env;
            // var container = customList.container;
            // var callback = customList.callback;
            function ComponentBuilder() {

                this.version = 1.0;
                this.update = function () {};
                this.destroy = function () {};
                this.create = function () {};

            }

            function buildComponentExternalEvent(customList) {

                var thisComponent = {};
                thisComponent.update = function () {};
                thisComponent.destroy = function () {
                    customList.container.find("#" + customList.name).remove();
                };
                thisComponent.create = function () {};
                return thisComponent;
            }

            function correlationTemplate(componentExternalObject, parentScope) {

                parentScope[customList.name + "Component"] = componentExternalObject;

                customList.props["thisUpdate"] = customList.name + "Component" + ".update";

                return componentExternalObject;
            }

            customList = queryParams(customList);
            if (customList.container) {
                this.elementReady(customList.container, function (correctElement) {
                    customList.container = $(correctElement);
                    return render(customList);
                });
            } else {
                throw Error("we needs a container to load directive module!");
            }

            function render(customList) {
                var isReplace = customList.replace;
                var directiveName = customList.name;
                var delayTime = customList.delay;
                var container = customList.container;
                var callback = customList.callback;
                var parentScope = customList.env;
                var props = customList.props;
                // var componentExternalObject =
                //     correlationTemplate(
                //         buildComponentExternalEvent(customList,parentScope)
                //         ,parentScope);

                var template = spillTemplate(customList);

                if (isReplace && container.find("[pms-id=" + directiveName + "]").length) {
                    container.find("[pms-id=" + directiveName + "]").remove();
                }

                if (delayTime) {
                    setTimeout(function () {
                        customList.env.$apply(container.append($compile(template)(parentScope)));
                        callback();
                    }, delayTime);
                } else {
                    container.append($compile(template)(parentScope));
                    callback();
                }

                return {};
            }

            function spillTemplate(customList) {
                var directiveName = splitToHtml(customList.name);
                var props = anlyzParams(customList.props);
                return "<" + directiveName + " " + props + "></" + directiveName + ">";

                function anlyzParams(object) {
                    var result = "";
                    Object.keys(object).forEach(function (key) {
                        var htmlProp = splitToHtml(key);
                        var htmlPropValue = object[key];
                        result += htmlProp + "='" + htmlPropValue + "' ";
                    });
                    return result;
                }

                // "directiveName" => "directive-name"
                function splitToHtml(string) {
                    var result = "";
                    var stringArray = string.split("");

                    stringArray.forEach(function (singleWord) {
                        if (singleWord === singleWord.toUpperCase()) {
                            result += "-" + singleWord.toLowerCase();
                        } else {
                            result += singleWord;
                        }
                    });

                    return result;
                }
            }

            function queryParams(customList) {
                var name = customList.name;
                var env = customList.env;
                var container = customList.container;
                if (!container) container = "#" + name + "Container"; // 如果不给与渲染的位置，就直接默认用户已经设定了一个和directiveName同名的ID到位置元素
                if (!name || !env || !container) throw Error("we needs a env to rendering directive module!");

                var props = customList.props ? customList.props : {};
                props['pmsId'] = name;

                var delay = customList.delay ? customList.delay : 0; //是否延迟渲染！
                var replace = customList.replace; //是否在每次刷新的时候，先删后加！
                var callback = customList.callback ? customList.callback : function () {};

                return {
                    name: name,
                    env: env,
                    container: container,
                    props: props,
                    delay: delay,
                    replace: replace,
                    callback: callback
                };
            }

        }

        ,
    queryElementType: function (targetOrSelector) {
            //1,如果是字符串，并且没有【#】和【.】 默认就定位【#】，如果获取不到，再获取【.】，如果获取到多个，就抛出错误，避免无法定位异常
            //2,如果是对象，就直接判断是否具有nodeType属性，如果有，就是原生dom，如果没有，就判断其长度，如果超过1个，就抛出错误
            //3,如果找不到对应的元素，统一返回null;
            var result = null;
            var doc = document;
            var element = null;
            if (typeof targetOrSelector === "string" && targetOrSelector.length > 0) {
                var selector = targetOrSelector;
                if (/^[#\.]/.test(selector)) {
                    element = doc.querySelectorAll(selector);
                    if (element.length > 1) {
                        throw Error("is not support multi rendering yet! please provides unique selector!");
                    } else if (element.length === 1) {
                        result = element[0];
                    } else {
                        console.log(element + " is not a correct element!");
                    }
                } else {

                    element = doc.getElementById(selector);
                    if (element) {
                        result = element;
                    } else {
                        element = doc.getElementsByClassName(selector);
                        if (element.length > 1) {
                            throw Error("is not support multi rendering yet! please provides unique selector!");
                        } else if (element.length === 1) {
                            result = element[0];
                        } else {
                            console.log(element + " is not a correct element!");
                        }
                    }
                }

            } else if (typeof targetOrSelector === "object") {
                var target = targetOrSelector;
                if (target.nodeType) {
                    result = target;
                } else {
                    if (target.length > 1) {
                        throw Error("is not support multi rendering yet! please provides unique selector!");
                    } else if (target.length === 1) {
                        result = target[0];
                    } else {
                        console.log(target + " is not a correct element!");
                    }
                }
            }

            return result;
        }

        /**
         * @elementOrSelector[Element|selector] dom元素或者选择器
         * @callback[Function] 回调
         * @topScope[pmsUtils] 递归使用，调用的时候【不需要传值】-- 其主要作用时在递归中能正确关联到当前的this域
         * @countTime[Number] 递归使用，调用的时候【不需要传值】-- 其主要作用时限制递归次数
         * */
        ,
    elementReady: function (elementOrSelector, callback, topScope, countTime) {

            var scope = topScope ? topScope : this;
            var selector = elementOrSelector.selector ? elementOrSelector.selector : elementOrSelector;
            var element = scope.queryElementType(selector);
            countTime = countTime ? countTime-- : 100;

            if (countTime <= 0) {
                return console.log("已经尽力了，确实找不到需要监听的元素！");
            }

            if (element) {
                return callback(element);
            } else {
                setTimeout(function () {
                    element = null;
                    return scope.elementReady(elementOrSelector, callback, scope, countTime);
                }, 45);
            }
        }

        ,
    bindEnterKey: function (callback) {
            $('body').off("keydown").on("keydown", function (event) {
                if (event.key === "Enter") {
                    callback();
                }
            })
        }

        ,
    getMonthLastDate: function (year, month, distance) {
            year = year ? year : new Date().getFullYear();
            month = month ? month : (new Date().getMonth() + 1);
            distance = distance ? distance : 0;
            var nextMoth = month + 1;
            var curMothLastDayObj = new Date(new Date(year + "-" + nextMoth) - 1000 * 60 * 60 * 24);
            return curMothLastDayObj.getDate() - parseInt(distance);
        }

        ,
    compare: function (originItems, modifiedItems, rowMark) {

            var result = {
                modifiedItems: [],
                newItems: [],
                abandonedItems: [],
                unmodifiedItems: []
            };

            rowMark = rowMark ? rowMark : "index";

            if (this.isEmpty(originItems) || this.isEmpty(modifiedItems)) {
                result.abandonedItems = originItems;
                result.newItems = modifiedItems;
                return result;
            }

            // 1，默认情况，修改的会比原数据多，那么多出来的必定是新的
            // 2，原始的比修改的多，那么，没匹配的就会被剔除
            // 3，修改的和原始的一个都匹配不上，也就是说，修改的全部是新增的
            if (this.isArray(originItems) && this.isArray(modifiedItems)) {

                modifiedItems.forEach(function (modifiedItem, modifiedIndex) {

                    if (modifiedItem[rowMark] !== undefined) {
                        originItems.forEach(function (originItem) {
                            // 相同对象，才进行比较
                            if (originItem[rowMark] === modifiedItem[rowMark]) {
                                originItem.isModified = false;
                                modifiedItem.isModified = false;
                                comparingItem(originItem, modifiedItem);
                            }
                        });

                    } else {
                        // 如果不提供标记，或者对应的标记没有赋值，就查找对应下标的originItem
                        var originItem = originItems[modifiedIndex];

                        // 如果对应的originItem有数据，就进行比对，如果没有，就证明modify是新增的
                        if (originItem) {
                            originItem.isModified = false;
                            modifiedItem.isModified = false;
                            comparingItem(originItem, modifiedItem);
                        }

                    }
                });

                modifiedItems.forEach(function (modifiedItem) {
                    if (modifiedItem.isModified === undefined) {
                        result.newItems.push(modifiedItem);
                    }
                    if (modifiedItem.isModified === false) {
                        delete modifiedItem.isModified;
                        result.unmodifiedItems.push(modifiedItem);
                    }
                    if (modifiedItem.isModified === true) {
                        delete modifiedItem.isModified;
                        result.modifiedItems.push(modifiedItem);
                    }
                });

                originItems.forEach(function (originItem) {

                    if (originItem.isModified === undefined) {
                        result.abandonedItems.push(originItem);
                    }
                });


                function comparingItem(originItem, modifiedItem) {
                    for (var prop in originItem) {
                        if (originItem.hasOwnProperty(prop) && prop !== "$$hasKey") {
                            originItem[prop] = typeof originItem[prop] === "string" ? originItem[prop].trim() : originItem[prop];
                            modifiedItem[prop] = typeof modifiedItem[prop] === "string" ? modifiedItem[prop].trim() : modifiedItem[prop];
                            if (originItem[prop] !== modifiedItem[prop]) {
                                originItem.isModified = true;
                                modifiedItem.isModified = true;
                                break;
                            }
                        }
                    }
                }
            }

            // 如果是对象类型，就返回字段名数组
            if (this.isObject(originItems) && this.isObject(modifiedItems)) {
                Object.keys(originItems).forEach(function (originKey) {
                    if (modifiedItems[originKey] === undefined) {
                        return result.abandonedItems.push(originKey);
                    }

                    if (modifiedItems[originKey] !== originItems[originKey]) {
                        result.modifiedItems.push(originKey);
                    } else {
                        result.unmodifiedItems.push(originKey);
                    }

                });

                Object.keys(modifiedItems).forEach(function (modifiedKey) {
                    if (originItems[modifiedKey] === undefined) {
                        result.newItems.push(modifiedKey);
                    }
                });
            }

            return result;
        }

        ,
    waiting: {
        start: function (timing) {
            $("#pmsWaitingLayer").remove();
            $("div[ui-view]").append('<table id="pmsWaitingLayer" style="width:100%;height:100%;position:absolute;left:0;top:0;z-index: 111111111;background:rgba(33,33,33,0.3)"><tbody><tr><td class="text-center"><img src="img/loading1.gif"></td></tr></tbody></table>');

            setTimeout(function () {
                $("#pmsWaitingLayer").remove();
            }, timing ? timing : 15000)
        },
        end: function () {
            $("#pmsWaitingLayer").remove();
        }
    }

    ,
    dateFormat: function (fmt) {
        //fmt 年-月-日 时:分:秒 季度 "YYYY-MM-DD hh:mm:ss q"
        var curDate = new Date();
        var o = {
            "M+": curDate.getMonth() + 1, //月份
            "D+": curDate.getDate(), //日
            "h+": curDate.getHours(), //小时
            "m+": curDate.getMinutes(), //分
            "s+": curDate.getSeconds(), //秒
            "q+": Math.floor((curDate.getMonth() + 3) / 3), //季度
            "S": curDate.getMilliseconds() //毫秒
        };
        if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (curDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}