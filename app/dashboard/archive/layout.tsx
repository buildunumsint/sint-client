import { ArchiveDialogsProvider } from "./_shared/context/ArchiveDialogsContext";
import CreateSacramentDialog from "./_shared/dialogs/sacraments";
import EditSacramentDialog from "./_shared/dialogs/sacraments/edit";

interface LayoutProps {
    children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
    return ( 
        <ArchiveDialogsProvider>
            {children}
            <CreateSacramentDialog />
            <EditSacramentDialog />
        </ArchiveDialogsProvider>
     );
}
 
export default Layout;