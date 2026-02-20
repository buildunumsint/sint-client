import { ArchiveDialogsProvider } from "./_shared/context/ArchiveDialogsContext";
import CreateSacramentDialog from "./_shared/dialogs/CreateSacramentDialog";

interface LayoutProps {
    children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
    return ( 
        <ArchiveDialogsProvider>
            {children}
            <CreateSacramentDialog />
        </ArchiveDialogsProvider>
     );
}
 
export default Layout;