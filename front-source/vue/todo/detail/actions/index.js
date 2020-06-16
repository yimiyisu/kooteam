import Attach from "./attach"
import Watcher from "./watcher"
import Owner from "./owner"
import Plan from "./plan"
import Priority from "./priority"
import Finish from "./finish"
import Remove from "./remove"
import Archive from "./archive"

export default {
    name: "actions",
    props: ["archiveId"],
    // components: {Attach, Watcher, Owner, Plan, Priority, Todo, Finish, Archive, Remove},
    render() {
        if (this.archiveId) {
            return <Archive target={this.archiveId}/>
        }
        return <div>
            <Finish/>
            <Priority/>
            <Owner/>
            <Plan/>
            <Attach/>
            <Watcher/>
            <Archive/>
            <Remove/>
        </div>
    }
}