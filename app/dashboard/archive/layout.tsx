import { ArchiveDialogsProvider } from "./_shared/context/ArchiveDialogsContext";
import CreateParishDialog from "./_shared/dialogs/parish";
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
            <CreateParishDialog/>
        </ArchiveDialogsProvider>
     );
}
 
export default Layout;