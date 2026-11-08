/**
 * The example programs the playground offers.
 *
 * The seven `.csc` files are the ones committed with the compiler, imported at
 * build time so they cannot drift from the coursework. The last entry is not
 * coursework; it is written for this page, and labelled as such, because
 * every committed example fails at the generate stage and there would
 * otherwise be no way to see the back end work at all.
 */
import dataBackup from '../../../courses/cmsi-3802/cloudscribe/examples/data_backup.csc?raw';
import generateReport from '../../../courses/cmsi-3802/cloudscribe/examples/generate_report.csc?raw';
import installSoftware from '../../../courses/cmsi-3802/cloudscribe/examples/install_software.csc?raw';
import networkMonitoring from '../../../courses/cmsi-3802/cloudscribe/examples/network_monitoring.csc?raw';
import restartSystem from '../../../courses/cmsi-3802/cloudscribe/examples/restart_system.csc?raw';
import securityScan from '../../../courses/cmsi-3802/cloudscribe/examples/security_scan.csc?raw';
import updateSystem from '../../../courses/cmsi-3802/cloudscribe/examples/update_system.csc?raw';

export type Example = { name: string; source: string; committed: boolean };

export const examples: Example[] = [
  { name: 'network_monitoring', source: networkMonitoring, committed: true },
  { name: 'data_backup', source: dataBackup, committed: true },
  { name: 'generate_report', source: generateReport, committed: true },
  { name: 'install_software', source: installSoftware, committed: true },
  { name: 'restart_system', source: restartSystem, committed: true },
  { name: 'security_scan', source: securityScan, committed: true },
  { name: 'update_system', source: updateSystem, committed: true },
  {
    name: 'no task (reaches JavaScript)',
    committed: false,
    source: `// Not a committed example. Written for this page, because every
// program in examples/ is wrapped in a task and the generator has
// no case for one. Without a task, the back end works.

let total = 0;

for i in [1, 2, 3] {
  total = total + i;
}

print("done");
`,
  },
];
