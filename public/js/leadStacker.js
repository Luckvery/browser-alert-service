var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var LeadStacker = React.createClass({
    getInitialState: function() {
        return {leads : []};
    },
    notify: function (data) {
        var stack_bottom_right = {"dir1": "left", "dir2": "up", "push": "top"};
        new PNotify({
            title: 'New lead from ' + data.name + ' !!!',
            text: JSON.stringify(data.comment),
            addclass: "stack-bottomright",
            stack: stack_bottom_right,
            opacity: .8
        });
    },
    createNewLead : function(data){
        var newLeadData = [].concat(this.state.leads);
        newLeadData.push([data.name, data.email, data.comment]);
        return newLeadData;
    },
    getReverseIndexLookUp : function(len){
        var lookUp = {};
        var inc = 0;
        for (var i = len-1; i >= 0 ; i--){
            lookUp[i] = inc++;
        }
        return lookUp;
    },
    addNewLead : function(data){
        var newLeadData = this.createNewLead(data);
        var newLeadDataLen = newLeadData.length;
        this.notify(data);
        this.setState({
            leads: newLeadData,
            reverseIndexLookUp : (newLeadDataLen == 0) ? {} : this.getReverseIndexLookUp(newLeadDataLen)
        });
    },
    componentDidMount: function() {
        var socket = io.connect();
        socket.on('leads', this.addNewLead.bind(this));
    },
    rowGetter : function (rowIndex) {
        return this.state.leads[this.state.reverseIndexLookUp[rowIndex]];
    },
    rowLen : function () {
        return this.state.leads.length;
    },
    leads: function() {
        return (
            <div>
               <Table
                  rowHeight={50}
                  rowGetter={this.rowGetter}
                  rowsCount={this.rowLen()}
                  width={800}
                  height={5000}
                  headerHeight={50}>
              <Column
                  label="name"
                  width={200}
                  dataKey={0} />
              <Column
                  label="email"
                  width={200}
                  dataKey={1}/>
              <Column
                  label="comment"
                  flexGrow={3}
                  width={300}
                  dataKey={2}/>
              </Table>
            </div>
        );
    },
    noLeads : function(){
        return (
            <div style={this.stackStyle}>
                <h2 style={this.headerStyle}>There are no leads at this time. Check back in a bit</h2>
            </div>
        )
    },
    render: function() {
        return (
            <div>
                 {this.state.leads.length > 0 ? this.leads() : this.noLeads()}
            </div>
        );
    }
});

window.LeadStacker = LeadStacker;

