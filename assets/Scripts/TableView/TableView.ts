import { TableViewCell } from "./TableViewCell";

const { ccclass, property, menu } = cc._decorator;

/**滑动的方式 Horizontal 水平滑动  Vertical 垂直滑动 */
const ScrollModel = cc.Enum({
    Horizontal: 0,
    Vertical: 1,
})

@ccclass
@menu("TableView/TableView")
export default class TableView extends cc.ScrollView {

    @property({ override: true, visible: false, tooltip: "重写父类的属性" })
    horizontal: boolean = false;

    @property({ override: true, visible: false, tooltip: "重写父类的属性" })
    vertical: boolean = true;

    @property({ type: cc.Prefab, tooltip: '' })
    cellPrefab: cc.Prefab = null;

    @property({ type: cc.Float, tooltip: '' })
    cellSpacing: number = 0;

    @property({ type: ScrollModel, tooltip: '滑动的方向' })
    scrollModel = ScrollModel.Vertical;

    private _data: any[] = [];
    private _cellPool: cc.NodePool = new cc.NodePool();
    private _activeCells: Map<number, cc.Node> = new Map();
    private _cellSize: cc.Size = cc.size(0, 0);


    // 可视区域管理
    private _visibleRange: { start: number, end: number } = { start: 0, end: -1 };
    private _lastContentPos: number = 0;

    private _updateOffset: number = 5;

    protected onLoad(): void {
        this.node.on("scrolling", this._onScrolling, this);
    }

    protected onDestroy(): void {
        this.node.off("scrolling", this._onScrolling, this);
        this._cellPool.clear();
    }

    /**
     * 初始化 TableView
     * @param data 数据
     */
    init(data: any[]) {
        if (!data || data.length <= 0) {
            return;
        }
        this._data = data;
        this._cellSize = this.cellPrefab.data.getContentSize();

        this.vertical = this.scrollModel === ScrollModel.Vertical;
        this.horizontal = this.scrollModel === ScrollModel.Horizontal;

        this._initCellPool();
        this._calculateLayout();
        this._updateVisibleCells();
    }

    /**
   * 刷新数据
   * @param data 新数据
   */
    public reloadData(data: any[]) {
        this._data = data;
        this._calculateLayout();
        this._updateVisibleCells(true); // 强制更新所有可见单元格
    }

    /**
     * 初始化单元格池
     */
    private _initCellPool() {
        // 计算预加载数量：可视区域可容纳的单元格数 + 缓冲
        const viewportSize = this.node.height;
        const cellHeight = this._cellSize.height + this.cellSpacing;
        const preloadCount = Math.ceil(viewportSize / cellHeight) * 2 + 2; // 缓冲

        for (let idx = 0; idx < preloadCount; idx++) {
            const cell = cc.instantiate(this.cellPrefab);
            this._cellPool.put(cell);
        }
    }

    /**
     * 计算布局 content 的大小
     * 注意：这里的 content 是指 TableView 的子节点，而不是 TableView 的内容
     */
    private _calculateLayout() {
        if (this.scrollModel === ScrollModel.Vertical) {
            const cellHeight = this._cellSize.height;
            const totalHeight = this._data.length * (cellHeight + this.cellSpacing) - this.cellSpacing;
            this.content.height = totalHeight > 0 ? totalHeight : 0;
        } else if (this.scrollModel === ScrollModel.Horizontal) {
            const cellWidth = this._cellSize.width;
            const totalWidth = this._data.length * (cellWidth + this.cellSpacing) - this.cellSpacing;
            this.content.width = totalWidth > 0 ? totalWidth : 0;
        }
    }

    private _updateVisibleCells(forceUpdate: boolean = false) {
        const newRange = this._calculateVisibleRange();
        // 当可视范围未变化且不需要强制更新时跳过
        if (!forceUpdate && newRange.start === this._visibleRange.start &&
            newRange.end === this._visibleRange.end) return;

        if (forceUpdate) {
            this._refreshVisibleCells(newRange);
        }
        this._recycleCellsOutsideRange(newRange);
        this._generateCellsInRange(newRange);
        this._visibleRange = newRange;
    }

    private _refreshVisibleCells(range: { start: number, end: number }) {
        for (let idx = range.start; idx <= range.end; idx++) {
            if (this._activeCells.has(idx)) {
                const cell = this._activeCells.get(idx);
                cell.getComponent(TableViewCell).updateView(idx, this._data[idx]);
            }
        }
    }

    private _calculateVisibleRange(): { start: number, end: number } {
        if (this.scrollModel === ScrollModel.Vertical) {
            return this._calculateVisibleRangeV();
        } else if (this.scrollModel === ScrollModel.Horizontal) {
            return this._calculateVisibleRangeH();
        }
    }

    private _calculateVisibleRangeV(): { start: number, end: number } {
        const scrollOffset = this.getScrollOffset().y;
        const cellHeight = this._cellSize.height + this.cellSpacing;

        if (cellHeight <= 0 || this._data.length === 0) {
            return { start: 0, end: -1 }; //无效范围
        }

        const startIdx = Math.floor(scrollOffset / cellHeight);
        const endIdx = Math.ceil((scrollOffset + this.node.height) / cellHeight);
        return {
            start: Math.max(0, startIdx - 1), // 上方缓冲一个
            end: Math.min(this._data.length - 1, endIdx + 1) // 下方缓冲一个
        }
    }

    private _calculateVisibleRangeH(): { start: number, end: number } {
        const scrollOffset = -this.getScrollOffset().x;
        const cellWidth = this._cellSize.width + this.cellSpacing;
        if (cellWidth <= 0 || this._data.length === 0) {
            return { start: 0, end: -1 }; //无效范围
        }

        const startIdx = Math.floor(scrollOffset / cellWidth);
        const endIdx = Math.ceil((scrollOffset + this.node.width) / cellWidth);
        return {
            start: Math.max(0, startIdx - 1), // 左方缓冲一个
            end: Math.min(this._data.length - 1, endIdx + 1) // 右方缓冲一个
        }
    }

    private _recycleCellsOutsideRange(range: { start: number, end: number }) {
        this._activeCells.forEach((cell, index) => {
            if (index < range.start || index > range.end) {
                this._recycleCellNode(cell);
                this._activeCells.delete(index);
            }
        });
    }

    private _generateCellsInRange(range: { start: number, end: number }) {
        for (let idx = range.start; idx <= range.end; idx++) {
            if (this._activeCells.has(idx)) {
                const cell = this._activeCells.get(idx);
                cell.getComponent(TableViewCell).resuse();
                this._updateCellPosition(cell, idx);
                cell.getComponent(TableViewCell).updateView(idx, this._data[idx]);
            } else {
                const cell = this._getCellNode();
                cell.getComponent(TableViewCell).resuse();
                this._updateCellPosition(cell, idx);
                cell.getComponent(TableViewCell).updateView(idx, this._data[idx]);
                this.content.addChild(cell);
                this._activeCells.set(idx, cell);
            }
        }
    }

    private _updateCellPosition(cell: cc.Node, index: number) {
        if (this.scrollModel === ScrollModel.Vertical) {
            this._updateCellPositionV(cell, index);
        } else if (this.scrollModel === ScrollModel.Horizontal) {
            this._updateCellPositionH(cell, index);
        }
    }

    private _updateCellPositionH(cell: cc.Node, index: number) {
        const cellWidth = this._cellSize.width + this.cellSpacing;
        const contentAnchor = this.content.anchorX;
        const basePosition = this.content.width * (1 - contentAnchor);
        const anchor = this.cellPrefab.data.anchorX;
        cell.x = index * cellWidth + this._cellSize.width * anchor - basePosition;
    }

    private _updateCellPositionV(cell: cc.Node, index: number) {
        const cellHeight = this._cellSize.height + this.cellSpacing;
        const contentAnchor = this.content.anchorY;
        const basePosition = this.content.height * (1 - contentAnchor);
        const anchor = this.cellPrefab.data.anchorY;
        cell.y = -index * cellHeight - this._cellSize.height * anchor + basePosition;
    }

    private _getCellNode(): cc.Node {
        if (this._cellPool.size() > 0) {
            return this._cellPool.get();
        }
        const cell = cc.instantiate(this.cellPrefab);
        return cell;
    }

    private _recycleCellNode(cell: cc.Node) {
        this._cellPool.put(cell);
        cell.getComponent(TableViewCell).unuse();
    }

    // 滚动事件处理（优化触发频率）
    private _onScrolling() {
        if (this.scrollModel === ScrollModel.Vertical) {
            this.onScrollingV();
        } else if (this.scrollModel === ScrollModel.Horizontal) {
            this.onScrollingH();
        }
    }

    private onScrollingH() {
        const delta = Math.abs(this._lastContentPos - this.getScrollOffset().x);
        if (delta > this._updateOffset) {
            this._updateVisibleCells();
            this._lastContentPos = this.getScrollOffset().x;
        }
    }

    private onScrollingV() {
        const delta = Math.abs(this._lastContentPos - this.getScrollOffset().y);
        if (delta > this._updateOffset) {
            this._updateVisibleCells();
            this._lastContentPos = this.getScrollOffset().y;
        }
    }

    scrollToTop() {
        super.scrollToTop();
        this._updateVisibleCells();
    }

    scrollToBottom() {
        super.scrollToBottom();
        this._updateVisibleCells();
    }

    scrollToLeft() {
        super.scrollToLeft();
        this._updateVisibleCells();
    }

    scrollToRight() {
        super.scrollToRight();
        this._updateVisibleCells();
    }
}