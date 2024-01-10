export interface passwordType {
    website_name: string;
    website_url: string;
    account: string;
    pwd: string;
    remarks: string;
    menu: number;
}

export interface psdForm {
    website_name: formItem;
    website_url: formItem;
    account: formItem;
    pwd: formItem;
    remarks: formItem;
    menu: formItem;
}

interface formItem {
    label: string;
    type: string;
}

interface page {
    total?: number;
    pageSize?: number;
    currentPage?: number;
}