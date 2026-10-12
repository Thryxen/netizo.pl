import { useHomeUi } from '@/components/home/home-ui-context';
import { deferred, useDeferredComponent } from '@/lib/deferred';

const callbackDialog = deferred(() => import('@/components/home/callback-dialog').then((module) => module.CallbackDialog));

/**
 * The callback dialog ("Zadzwońcie do mnie") of the pages with the contact section (home, service pages): its code is
 * fetched once the page is idle, or on the first open if that comes sooner. Place it inside <HomeUiProvider>.
 */
export function DeferredCallbackDialog() {
    const { callbackOpen } = useHomeUi();
    const CallbackDialog = useDeferredComponent(callbackDialog, callbackOpen);

    return CallbackDialog ? <CallbackDialog /> : null;
}
